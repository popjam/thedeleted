import {
  ButtonAction,
  ModCallback,
  SlotVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getPlayerFromIndex,
  getPlayerIndex,
  getSlots,
  gridCoordinatesToWorldPosition,
  ModCallbackCustom,
  PlayerIndex,
  sfxManager,
  spawnSlot,
} from "isaacscript-common";
import { SoundEffectCustom } from "../../../enums/general/SoundEffectCustom";
import { PCState } from "../../../enums/PCStatus";
import { switchToNextModeOnCarousel } from "../../../helper/deletedSpecific/modeHelper";
import { getDistanceBetweenEntities } from "../../../helper/entityHelper";
import { fprint } from "../../../helper/printHelper";
import { Facet, initGenericFacet } from "../../Facet";

/**
 * Handles everything to do with the physical spawn PC. PC only spawns when first Deleted spawns in.
 * PC can only be used at the start of the run, before exiting the starting room. PC only has one
 * user at a time, who must be standing close to it. Once another user logs on or user logs off, the
 * now-logged-off user is physically booted from the PC.
 */

const DETECTION_RADIUS = 35;
const ACTIVATION_SFX = SoundEffectCustom.PC_LOG_IN;
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

let FACET: Facet | undefined;
class PCFacet extends Facet {
  @Callback(ModCallback.POST_PEFFECT_UPDATE)
  postPeffectUpdate(player: EntityPlayer): void {
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
        fprint("Can not find the active PC anymore, unsubscribing.");
        v.run.state = PCState.OFFLINE;
        this.unsubscribe();
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRenderReordered(player: EntityPlayer): boolean | float | undefined {
    if (!isPlayerPCUser(player)) {
      return;
    }
    /** Player can't shoot while using PC. */
    player.SetShootingCooldown(1);
    if (
      Input.IsActionTriggered(ButtonAction.SHOOT_RIGHT, player.ControllerIndex)
    ) {
      fprint("PC: Switching to next mode on carousel.");
      switchToNextModeOnCarousel(player);
    }
    return undefined;
  }
}

export function initPCFacet(): void {
  FACET = initGenericFacet(PCFacet, v);
}

/**
 * Spawns the PC in the top left grid index.
 * TODO: Sort out EntitySlotCustom and adjust position.
 */
export function setupPC(): void {
  if (hasPCSpawned()) {
    fprint("PC has already spawned, not setting it up.");
    return;
  }
  v.run.spawned = true;
  const PC = spawnSlot(
    SlotVariant.SLOT_MACHINE,
    200,
    gridCoordinatesToWorldPosition(0, 0),
  );
  v.run.index = GetPtrHash(PC);
  v.run.state = PCState.ACCOUNT;
  fprint("Setting up PC, subscribing to PCFacet...");
  FACET?.subscribe();
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

/** Checks if the PC has spawned at the start of the game. It will spawn when any Deleted
 * player spawns in (only once).
 */
export function hasPCSpawned(): boolean {
  return v.run.spawned;
}

/** Checks if the player is the current user, if there is one. */
export function isPlayerPCUser(player: EntityPlayer): boolean {
  const currentPCUser = getCurrentPCUser();
  if (currentPCUser === undefined) {
    return false;
  }
  return getPlayerIndex(currentPCUser) === getPlayerIndex(player);
}
