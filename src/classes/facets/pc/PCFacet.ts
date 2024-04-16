import type { SlotVariant } from "isaac-typescript-definitions";
import { ButtonAction, SoundEffect } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import {
  CallbackCustom,
  ModCallbackCustom,
  getPlayerFromIndex,
  getPlayerIndex,
  getSlots,
  gridCoordinatesToWorldPosition,
  sfxManager,
  spawnSlot,
} from "isaacscript-common";
import { SoundEffectCustom } from "../../../enums/general/SoundEffectCustom";
import { PCAnimation } from "../../../enums/pc/PCAnimation";
import { PCState } from "../../../enums/pc/PCStatus";
import { switchToNextModeOnCarousel } from "../../../helper/deletedSpecific/modeHelper";
import { getDistanceBetweenEntities } from "../../../helper/entityHelper";
import { fprint } from "../../../helper/printHelper";
import { Facet, initGenericFacet } from "../../Facet";

/**
 * Handles everything to do with the physical spawn PC. PC only spawns when the first Deleted spawns
 * in. The PC can only be used at the start of the run, before exiting the starting room.
 *
 * The PC only has one user at a time, who must be standing close to it. Once another user logs on
 * or user logs off, the now-logged-off user is physically booted from the PC.
 */

/** The distance that the PC can detect a User. */
const DETECTION_RADIUS = 35;

/** Sound effect when a User logs on to the PC. */
const ACTIVATION_SFX = SoundEffectCustom.PC_LOG_IN;

/** Sound effect when a User logs off the PC. */
const DEACTIVATION_SFX = SoundEffect.CHARACTER_SELECT_RIGHT;

/** The PC's variant. */
const PC_VARIANT = Isaac.GetEntityVariantByName(
  "Deleted Computer",
) as SlotVariant;

/** The PC's SubType. */
const PC_SUBTYPE = 0;

// eslint-disable-next-line isaacscript/require-v-registration
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
  /**
   * In this callback, PC state is determined, and current user is continuously pinged to make sure
   * they are still in range.
   */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPeffectUpdateReordered(player: EntityPlayer): void {
    const { state } = v.run;
    if (!isPCActive()) {
      return;
    }

    /** If the PC can not be found (e.g out of the starting room), switch it to "OFFLINE". */
    const pc = getPC();
    if (pc === undefined) {
      fprint("Can not find the active PC anymore, unsubscribing from PCFacet.");
      v.run.state = PCState.OFFLINE;
      this.unsubscribe();
      return;
    }

    /** If the PC is in Account mode (mode it is set up in), continuously check for user. */
    if (state === PCState.ACCOUNT) {
      if (isPCBeingUsed()) {
        const currentPCUser = getCurrentPCUser();
        if (currentPCUser === undefined) {
          v.run.user = null;
        } else if (!(isPlayerInPCRange(currentPCUser, pc) ?? false)) {
          bootCurrentUserFromPC();
        }
      } else if (isPlayerInPCRange(player, pc) ?? false) {
        logOnToPC(player);
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRenderReordered(player: EntityPlayer): boolean | float | undefined {
    if (!isPlayerPCUser(player)) {
      return undefined;
    }

    /** User can't shoot. */
    player.SetShootingCooldown(1);
    if (
      Input.IsActionTriggered(ButtonAction.SHOOT_RIGHT, player.ControllerIndex)
    ) {
      fprint("PC: Switching to next mode on carousel.");
      switchToNextModeOnCarousel(player);
    } else if (
      Input.IsActionTriggered(ButtonAction.SHOOT_LEFT, player.ControllerIndex)
    ) {
      fprint("PC: Switching to previous mode on carousel.");
      switchToNextModeOnCarousel(player, false);
    }
    return undefined;
  }
}

export function initPCFacet(): void {
  FACET = initGenericFacet(PCFacet, v);
}

/**
 * Spawns the PC in the top left grid index.
 * TODO: Sort out EntitySlotCustom and adjust position for greed mode.
 */
// POST_PLAYER_INIT_FIRST
export function setupPC(): void {
  if (hasPCSpawned()) {
    fprint("PC has already spawned, not setting it up.");
    return;
  }
  v.run.spawned = true;
  const PC = spawnSlot(
    PC_VARIANT,
    PC_SUBTYPE,
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
  if (currentPCUser === undefined) {
    /** Only play sound effects and animation if there was no one previously using PC. */
    sfxManager.Play(ACTIVATION_SFX);
    playInitiateAnimation();
  } else {
    bootCurrentUserFromPC();
  }

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
// TODO: Physically boot user from PC and play 'boot' animation.
export function bootCurrentUserFromPC(): void {
  sfxManager.Play(DEACTIVATION_SFX);
  playIdleOffAnimation();
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
  return getSlots(PC_VARIANT, PC_SUBTYPE)[0];
}

/**
 * Checks if the PC has spawned at the start of the game. It will spawn when any Deleted player
 * spawns in (only once).
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

function playInitiateAnimation() {
  const pc = getPC();
  if (pc === undefined) {
    return;
  }
  pc.GetSprite().Play(PCAnimation.INITIATE, true);
}

function playIdleOffAnimation() {
  const pc = getPC();
  if (pc === undefined) {
    return;
  }
  pc.GetSprite().Play(PCAnimation.IDLE_OFF, true);
}

function playIdleOnAnimation() {
  const pc = getPC();
  if (pc === undefined) {
    return;
  }
  pc.GetSprite().Play(PCAnimation.IDLE_ON, true);
}
