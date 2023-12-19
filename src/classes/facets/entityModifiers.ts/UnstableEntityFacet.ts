import { ModCallback, SoundEffect } from "isaac-typescript-definitions";
import type { PickupIndex } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  game,
  getRoomListIndex,
  getTSTLClassName,
  isPickup,
  sfxManager,
} from "isaacscript-common";
import { explodeEntity } from "../../../helper/entityHelper/explodeEntity";
import { getPickupWithPickupIndex } from "../../../helper/entityHelper/pickupIndexHelper";
import {
  isPickupBeingCollected,
  isUselessPickup,
} from "../../../helper/pickupHelper";
import { fprint } from "../../../helper/printHelper";
import { isRoomAdjacent } from "../../../helper/roomHelper";
import { mod } from "../../../mod";
import { Facet, initGenericFacet } from "../../Facet";
import type { Range } from "../../../types/general/Range";
import { randomInRange } from "../../../types/general/Range";
import { secondsToGameFrames } from "../../../helper/gameHelper";

const SECONDS_LEFT_UNTIL_FAST_BEEP = 1;
const SLOW_BEEP_INTERVAL_SEC = 1;
const FAST_BEEP_INTERVAL_SEC = 0.1;
const BEEP_SOUND_EFFECT = SoundEffect.BEEP;
const NEXT_ROOM_SHAKE_DURATION = 5;
const OTHER_ROOM_SHAKE_DURATION = 1;
const DEFAULT_SEC_TO_EXPLODE_RANGE = [2, 8] as Range;

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  level: {
    /** [RoomListIndex, GameFramesToExplode]. */
    pickupsBeingExtracted: new Map<PickupIndex, [int, int]>(),

    /** [RoomListIndex, Pickups to remove. ] */
    pickupsToRemove: new Map<int, PickupIndex[]>(),
  },
  room: {
    enemiesBeingExtracted: new Map<Entity, int>(),
  },
};

/**
 * Unstable entities count down in seconds until they explode. The explosion hurts anything in a
 * radius and spawns a harmful fire on the ground. The explosion can be heard in other rooms if you
 * leave the room with an unstable pickup.
 */
let FACET: Facet | undefined;
class UnstableEntityFacet extends Facet {
  /** No entities last throughout floors. */
  @CallbackCustom(ModCallbackCustom.PRE_NEW_LEVEL)
  preNewLevel(): void {
    this.unsubscribeAll();
  }

  /** This is where it all happens. */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPeffectUpdateReordered(): void {
    this.updatePickups();
    this.updateEnemies();
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // Remove pickups that are in the room that we just entered.
    const currentRoomListIndex = getRoomListIndex();
    const pickupsToRemove = v.level.pickupsToRemove.get(currentRoomListIndex);
    if (pickupsToRemove !== undefined) {
      for (const pickupIndex of pickupsToRemove) {
        const pickup = getPickupWithPickupIndex(pickupIndex);
        if (pickup !== undefined) {
          pickup.Remove();
        }
      }

      v.level.pickupsToRemove.delete(currentRoomListIndex);
    }

    this.unsubscribeIfNotInUse();
  }

  /**
   * If a pickup is being removed by means other than leaving the room, if it is unstable, remove it
   * from the map.
   * TODO: MAKE SURE DOESN'T FIRE WHEN PLAYER IS LEAVING GAME.
   */
  @Callback(ModCallback.POST_ENTITY_REMOVE)
  postEntityRemove(entity: Entity): void {
    if (!isPickup(entity)) {
      return undefined;
    }

    if (mod.isLeavingRoom()) {
      return undefined;
    }

    const pickupIndex = mod.getPickupIndex(entity);
    if (v.level.pickupsBeingExtracted.has(pickupIndex)) {
      v.level.pickupsBeingExtracted.delete(pickupIndex);
      this.unsubscribeIfNotInUse();
    }
  }

  updatePickups(): void {
    for (const [pickupIndex, [pickupRoomListIndex, numFrames]] of v.level
      .pickupsBeingExtracted) {
      /** It's exploding. */
      if (numFrames <= 0) {
        v.level.pickupsBeingExtracted.delete(pickupIndex);
        const currentRoomListIndex = getRoomListIndex();

        /** Pickup is in another room. */
        if (currentRoomListIndex !== pickupRoomListIndex) {
          // TODO: Remove pickup upon entering the room it's in.
          if (isRoomAdjacent(pickupRoomListIndex)) {
            // If room is adjacent, make a small explosion sound and screen shake.
            sfxManager.Play(SoundEffect.EXPLOSION_WEAK);
            game.ShakeScreen(NEXT_ROOM_SHAKE_DURATION);
          } else {
            // Anywhere else, only the shake.
            game.ShakeScreen(OTHER_ROOM_SHAKE_DURATION);
          }

          // Add the pickup to the list of pickups to remove when we enter the room.
          let pickupsToRemove =
            v.level.pickupsToRemove.get(pickupRoomListIndex);
          if (pickupsToRemove === undefined) {
            pickupsToRemove = [];
            v.level.pickupsToRemove.set(pickupRoomListIndex, pickupsToRemove);
          }
          pickupsToRemove.push(pickupIndex);
          continue;
        }

        /** Pickup is in the room. */
        const pickup = getPickupWithPickupIndex(pickupIndex);
        if (pickup === undefined) {
          continue;
        }

        if (isPickupBeingCollected(pickup)) {
          continue;
        }

        if (isUselessPickup(pickup)) {
          continue;
        }

        explodeEntity(pickup);
        continue;
      }

      v.level.pickupsBeingExtracted.set(pickupIndex, [
        pickupRoomListIndex,
        numFrames - 1,
      ]);

      /** Make the 'beeping' sound. */
      const pickup = getPickupWithPickupIndex(pickupIndex);
      if (pickup === undefined) {
        continue;
      }

      if (isUselessPickup(pickup)) {
        v.level.pickupsBeingExtracted.delete(pickupIndex);
        continue;
      }

      /** Make the 'beeping' sound. */
      this.makeBeepSound(pickup, numFrames);
    }

    this.unsubscribeIfNotInUse();
  }

  updateEnemies(): void {
    for (const [entity, numFrames] of v.room.enemiesBeingExtracted) {
      /** Is exploding. */
      if (numFrames <= 0) {
        v.room.enemiesBeingExtracted.delete(entity);
        if (entity.IsDead() || !entity.Exists()) {
          continue;
        }
        explodeEntity(entity);
        continue;
      }

      v.room.enemiesBeingExtracted.set(entity, numFrames - 1);

      /** Make the 'beeping' sound. */
      this.makeBeepSound(entity, numFrames);
    }

    this.unsubscribeIfNotInUse();
  }

  makeBeepSound(entity: Entity, framesTilExplode: number): void {
    if (framesTilExplode > secondsToGameFrames(SECONDS_LEFT_UNTIL_FAST_BEEP)) {
      /** Slow beep. */
      if (
        framesTilExplode % secondsToGameFrames(SLOW_BEEP_INTERVAL_SEC) ===
        0
      ) {
        entity.SetColor(Color(1, 0, 0, 1, 0, 0, 0), 10, 0, true, false);
        sfxManager.Play(SoundEffect.BEEP, 10);
      }

      /** Fast beep. */
    } else if (
      framesTilExplode % secondsToGameFrames(FAST_BEEP_INTERVAL_SEC) ===
      0
    ) {
      entity.SetColor(Color(1, 0, 0, 1, 0, 0, 0), 3, 0, true, false);
      sfxManager.Play(BEEP_SOUND_EFFECT);
    }
  }

  /** Unsubscribe if there is no entities that are using this Facet. */
  unsubscribeIfNotInUse(): void {
    if (
      v.level.pickupsBeingExtracted.size === 0 &&
      v.room.enemiesBeingExtracted.size === 0 &&
      v.level.pickupsToRemove.size === 0
    ) {
      fprint(
        "Unsubscribing from the unstable entity Facet. (no entities in use)",
      );
      this.unsubscribeAll();
    }
  }
}

export function initUnstableEntityFacet(): void {
  FACET = initGenericFacet(UnstableEntityFacet, v);
}

/**
 * Set an entity to explode after an amount of seconds. For pickups, this will even work if the
 * player has gone into another room. For enemies, once the player has left a room the instability
 * will be removed.
 *
 * @param entity The entity to make unstable.
 * @param secToExplode The amount of seconds until the entity explodes. If not given, a random
 *                     amount of seconds will be chosen.
 */
export function setEntityInstability(
  entity: Entity,
  secToExplode?: number,
): Entity {
  secToExplode ??= randomInRange(DEFAULT_SEC_TO_EXPLODE_RANGE);
  if (isPickup(entity)) {
    const pickupIndex = mod.getPickupIndex(entity);
    const numFrames = secToExplode * GAME_FRAMES_PER_SECOND;
    v.level.pickupsBeingExtracted.set(pickupIndex, [
      getRoomListIndex(),
      numFrames,
    ]);
  } else {
    v.room.enemiesBeingExtracted.set(
      entity,
      secToExplode * GAME_FRAMES_PER_SECOND,
    );
  }

  FACET?.subscribeIfNotAlready();
  return entity;
}

/** Returns true if the given pickup is unstable and going to explode. */
export function isPickupUnstable(entityPickup: EntityPickup): boolean {
  return v.level.pickupsBeingExtracted.has(mod.getPickupIndex(entityPickup));
}

/** Returns true if the NPC is unstable and going to explode. */
export function isNPCUnstable(entityNPC: EntityNPC): boolean {
  const npcPtrHash = GetPtrHash(entityNPC);
  for (const [entity, _] of v.room.enemiesBeingExtracted) {
    if (GetPtrHash(entity) === npcPtrHash) {
      return true;
    }
  }

  return false;
}
