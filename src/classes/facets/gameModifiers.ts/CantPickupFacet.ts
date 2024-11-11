import type { PickupVariant } from "isaac-typescript-definitions";
import { ModCallback } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import { Callback, getPlayerIndex, getTSTLClassName } from "isaacscript-common";
import { fprint } from "../../../helper/printHelper";
import { Facet, initGenericFacet } from "../../Facet";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  run: {
    player: new Map<PlayerIndex, Array<[PickupVariant, number]>>(),
  },
};

let FACET: Facet | undefined;
class CantPickupFacet extends Facet {
  @Callback(ModCallback.PRE_PICKUP_COLLISION)
  prePickupCollision(
    pickup: EntityPickup,
    collider: Entity,
    low: boolean,
  ): boolean | undefined {
    const player = collider.ToPlayer();
    if (player === undefined) {
      return undefined;
    }


    const playerIndex = getPlayerIndex(player);
    const pickups = v.run.player.get(playerIndex);
    if (pickups === undefined) {
      return undefined;
    }

    /** Check if the pickup matches. */
    const cantPickup = pickups.some(([pickupVariant, pickupSubType]) => {
      if (pickupVariant !== pickup.Variant) {
        return false;
      }

      if (pickupSubType !== 0 && pickupSubType !== pickup.SubType) {
        return false;
      }

      return true;
    });

    if (cantPickup) {
      return false;
    }

    return undefined;
  }
}

export function initCantPickupFacet(): void {
  FACET = initGenericFacet(CantPickupFacet, v);
}

/**
 * Make a player not able to pickup a certain type of pickup. If the pickupSubType is left
 * unspecified, it will default to all SubTypes.
 */
export function setPlayerCantPickup(
  player: EntityPlayer,
  pickupVariant: PickupVariant,
  pickupSubType = 0,
): void {
  const playerIndex = getPlayerIndex(player);

  const pickups = v.run.player.get(playerIndex);
  if (pickups === undefined) {
    v.run.player.set(playerIndex, [[pickupVariant, pickupSubType]]);
  } else {
    pickups.push([pickupVariant, pickupSubType]);
  }

  fprint(
    `Player ${playerIndex} can no longer pickup ${pickupVariant} ${pickupSubType}`,
  );
  FACET?.subscribeIfNotAlready();
}

/** Undo any modifications */
export function removePlayerCantPickup(
  player: EntityPlayer,
  pickupVariant: PickupVariant,
  pickupSubType = 0,
): void {
  const playerIndex = getPlayerIndex(player);

  const pickups = v.run.player.get(playerIndex);
  if (pickups === undefined) {
    return;
  }

  const index = pickups.findIndex(
    ([pickupVariant2, pickupSubType2]) =>
      pickupVariant === pickupVariant2 && pickupSubType === pickupSubType2,
  );
  if (index === -1) {
    return;
  }

  pickups.splice(index, 1);
  fprint(
    `Player ${playerIndex} can now pickup ${pickupVariant} ${pickupSubType}`,
  );
  if (pickups.length === 0) {
    v.run.player.delete(playerIndex);
  }

  if (v.run.player.size === 0) {
    FACET?.unsubscribe();
  }
}
