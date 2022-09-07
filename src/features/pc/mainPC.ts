import { SlotVariant, SoundEffect } from "isaac-typescript-definitions";
import {
  getPlayerFromIndex,
  getPlayerIndex,
  getSlots,
  gridCoordinatesToWorldPosition,
  PlayerIndex,
  saveDataManager,
  sfxManager,
  spawnSlot,
} from "isaacscript-common";
import { PCState } from "../../enums/PCStatus";
import { isPlayerDeleted } from "../../helper/deletedSpecific/deletedHelper";
import { getDistanceBetweenEntities } from "../../helper/generalHelper";

/**
 * Handles everything to do with the physical spawn PC. PC only spawns when first Deleted spawns in.
 * PC can only be used at the start of the run, before exiting the starting room. PC only has one
 * user at a time, who must be standing close to it. Once another user logs on or user logs off, the
 * now-logged-off user is physically booted from the PC.
 */

const DETECTION_RADIUS = 35;
const ACTIVATION_SFX = SoundEffect.CHARACTER_SELECT_LEFT;
const DEACTIVATION_SFX = SoundEffect.CHARACTER_SELECT_RIGHT;

const v = {
  run: {
    /** Index of player using PC, or null if no users. */
    user: null as PlayerIndex | null,

    /** What state the PC is in. */
    state: PCState.OFFLINE,

    /** PtrHash of the PC. */
    index: null as PtrHash | null,

    /** Initial spawn tracker. */
    spawned: false,
  },
};

export function mainPCInit(): void {
  saveDataManager("mainPC", v);
}

/**
 * Handles spawning the PC only once when a Deleted pops in.
 * TODO: Make sure it only spawns in spawn & not after save & continue.
 */
export function mainPCPostPlayerInitFirst(player: EntityPlayer): void {
  if (!v.run.spawned && isPlayerDeleted(player)) {
    setupPC();
  }
}

/** Depending on the PC state, determines what actions the PC should make. */
/** TODO: Set up printing to console system. */
export function mainPCPostPeffectUpdate(player: EntityPlayer): void {
  const { state } = v.run;
  if (isPCActive()) {
    const pc = getPC();
    if (pc !== undefined) {
      if (state === PCState.ACCOUNT) {
        if (isPCBeingUsed()) {
          const currentPCUser = getCurrentPCUser();
          if (currentPCUser !== undefined) {
            if (!(isPlayerInPCRange(currentPCUser, pc) ?? false)) {
              bootCurrentUserFromPC();
            }
          } else {
            v.run.user = null;
          }
        } else if (isPlayerInPCRange(player, pc) ?? false) {
          logOnToPC(player);
        }
      }
    } else {
      v.run.state = PCState.OFFLINE;
    }
  }
}

/**
 * Spawns the PC in the top left grid index.
 * TODO: Sort out EntitySlotCustom and adjust position.
 */
export function setupPC(): void {
  v.run.spawned = true;
  const PC = spawnSlot(
    SlotVariant.SLOT_MACHINE,
    200,
    gridCoordinatesToWorldPosition(0, 0),
  );
  v.run.index = GetPtrHash(PC);
  v.run.state = PCState.ACCOUNT;
}

/** Logs player into PC, booting previous user if any. */
export function logOnToPC(player: EntityPlayer): void {
  const currentPCUser = getCurrentPCUser();
  if (currentPCUser !== undefined) {
    bootCurrentUserFromPC();
  }

  sfxManager.Play(ACTIVATION_SFX);
  v.run.user = getPlayerIndex(player);
}

/** Returns true if the PC is online. */
export function isPCActive(): boolean {
  return !(v.run.state === PCState.OFFLINE);
}

/** Checks if PC has a current user. */
export function isPCBeingUsed(): boolean {
  return !(v.run.user === null);
}

/** Gets current PC user, if any. */
export function getCurrentPCUser(): EntityPlayer | undefined {
  if (v.run.user === null) {
    return undefined;
  }

  return getPlayerFromIndex(v.run.user);
}

/** Removes the user by physically pushing them away. */
export function bootCurrentUserFromPC(): void {
  sfxManager.Play(DEACTIVATION_SFX);
  v.run.user = null;
}

/** Checks if player is in PC range, leave pc empty to manually get PC. */
function isPlayerInPCRange(
  player: EntityPlayer,
  pc: EntitySlot | undefined = getPC(),
): boolean | undefined {
  if (pc === undefined) {
    return;
  }
  return DETECTION_RADIUS > getDistanceBetweenEntities(pc, player);
}

/** If the PC is in the room, returns it. */
function getPC(): EntitySlot | undefined {
  return getSlots(SlotVariant.SLOT_MACHINE, 200)[0];
}
