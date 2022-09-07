/**
 * Keeps track of and manages the inversion status of pickups, more specifically pedestals. If a
 * pedestal spawns of unknown inversion status (e.g when first loading in), it is defaulted to the
 * current game inversion status. Also manages what happens when a player picks up an item with
 * corrupted effects.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import {
  DefaultMap,
  defaultMapGetPlayer,
  defaultMapSetPlayer,
  getCollectibles,
  getPickupIndex,
  getPlayerIndex,
  PickingUpItemCollectible,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { PickupIndex } from "isaacscript-common/dist/types/PickupIndex";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { fprint } from "../../helper/printHelper";
import { isGameInverted } from "./inversion";

/**
 * Keeps track of and manages 'corrupt items'. When an item spawns, the game checks if it should be
 * inverted or not by looking at the game inversion status. If the item should be inverted, inverts
 * it.
 */

const v = {
  run: {
    currentlyPickingUpType: new DefaultMap<PlayerIndex, CollectibleType>(
      CollectibleType.SAD_ONION,
    ),
  },
  level: {
    /** Default pedestal inversion status is the current game inversion status. */
    isInverted: new DefaultMap<PickupIndex, boolean>(() => isGameInverted()),
  },
};

export function corruptItemsInit(): void {
  saveDataManager("corruptItems", v);
}

/** Every time a pedestal spawns, scan it. */
export function corruptItemsPostPickupInitLate(
  pickup: EntityPickupCollectible,
): void {
  fprint(
    `corruptItems: pedestal init, of pickup index: ${getPickupIndex(pickup)}`,
  );
  scanPedestal(pickup);
}

/**
 * Updates the pedestals appearance to match its inversion status, makes sure corrupted items have
 * actions.
 */
export function scanPedestal(collectible: EntityPickupCollectible): void {
  const isInverted = v.level.isInverted.getAndSetDefault(
    getPickupIndex(collectible),
  );
  fprint(
    `corruptItems: scanning pedestal of index ${getPickupIndex(
      collectible,
    )}, its ${isInverted ? "inverted" : "non-inverted"}`,
  );
  if (isInverted) {
    collectible.FlipX = true;
  } else {
    collectible.FlipX = false;
  }
}

/**
 * Update the appearance of pedestals in the room to match their inversion status, and makes sure
 * all inverted items have actions.
 */
export function scanPedestalsInRoom(): void {
  getCollectibles().forEach((pedestal) => scanPedestal(pedestal));
}

/** Set one item to a specific inversion status. This will also scan the pedestal. */
export function setItemInversion(
  desiredInversionStatus: boolean,
  collectible: EntityPickupCollectible,
): void {
  v.level.isInverted.set(getPickupIndex(collectible), desiredInversionStatus);
  scanPedestal(collectible);
}

/**
 * Sets all items on the floor to a specific inversion status. This will also scan all pedestals in
 * the room.
 */
export function setAllItemsOnLevelInversion(
  desiredInversionStatus: boolean,
): void {
  v.level.isInverted.forEach((value, key) =>
    v.level.isInverted.set(key, desiredInversionStatus),
  );
  scanPedestalsInRoom();
}

/**
 * Set all the items in the room to the desired inversion status. This will also scan all pedestals
 * in the room.
 */
export function setAllItemsInRoomInversion(
  desiredInversionStatus: boolean,
): void {
  const itemsInRoom = getCollectibles();
  itemsInRoom.forEach((value) => {
    const pickupIndex = getPickupIndex(value);
    v.level.isInverted.set(pickupIndex, desiredInversionStatus);
  });
  scanPedestalsInRoom();
}

/** Prints the pedestals pickupIndex after picking up the item on it. */
// TODO: Does it work?
export function corruptItemsPreItemPickupCollectible(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
): void {
  if (pickingUpItem.subType === CollectibleTypeCustom.ZAZZ) {
    fprint(
      `corruptItems: ${getPlayerIndex(
        player,
      )} picked up corrupt item of subType: ${defaultMapGetPlayer(
        v.run.currentlyPickingUpType,
        player,
      )}`,
    );
    onPreItemPickupCorruptedCollectible(
      player,
      defaultMapGetPlayer(v.run.currentlyPickingUpType, player),
    );
  }
}

/**
 * Upon picking up an item, but before it is added to ItemQueue. If the item pedestal is inverted,
 * swap it for 'ZAZZ' right before its picked up.
 */
export function corruptItemsPreGetPedestalCollectible(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
): boolean | undefined {
  const pickupIndex = getPickupIndex(pickup);
  const isInverted = v.level.isInverted.getAndSetDefault(pickupIndex);
  if (pickup.SubType === CollectibleTypeCustom.ZAZZ) {
    return undefined;
  }
  if (isInverted) {
    fprint(
      `corruptItems: ${getPlayerIndex(
        player,
      )} picked up a corrupt item of subType: ${pickup.SubType}`,
    );
    defaultMapSetPlayer(v.run.currentlyPickingUpType, player, pickup.SubType);
    pickup.SubType = CollectibleTypeCustom.ZAZZ;
    return false;
  }
  return undefined;
}

export function onPreItemPickupCorruptedCollectible(
  player: EntityPlayer,
  collectible: CollectibleType,
): void {}
