/**
 * Keeps track of and manages the inversion status of pickups, more specifically pedestals. If a
 * pedestal spawns of unknown inversion status (e.g when first loading in), it is defaulted to the
 * current game inversion status. Also manages what happens when a player picks up an item with
 * corrupted effects.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import {
  ColorDefault,
  DefaultMap,
  defaultMapGetPlayer,
  defaultMapSetPlayer,
  getCollectibles,
  getPickupIndex,
  getPlayerIndex,
  PickingUpItemCollectible,
  PickupIndex,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { fprint } from "../../../helper/printHelper";
import {
  addInvertedItemToPlayer,
  getInvertedItemActionSet,
  getNormalItemActionSet,
} from "../effects/itemEffects";
import { isGameInverted } from "./playerInversion";

/**
 * Keeps track of and manages 'inverted items'. When an item spawns, the game checks if it should be
 * inverted or not by looking at the game inversion status. If the item should be inverted, inverts
 * it.
 */
// TODO: Update to track all pickup inversions.

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

export function pickupInversionInit(): void {
  saveDataManager("pickupInversion", v);
}

/** Every time a pedestal spawns, scan it. */
export function pickupInversionPostPickupInitLate(
  pickup: EntityPickupCollectible,
): void {
  fprint(
    `pickupInversion: pedestal init, of pickup index: ${getPickupIndex(
      pickup,
    )}`,
  );
  updatePedestalAppearance(pickup);
}

/**
 * Updates the pedestals appearance to match its inversion status, and ActionSet. Non-inverted
 * pedestals may not have an ActionSet.
 */
export function updatePedestalAppearance(
  collectible: EntityPickupCollectible,
): void {
  const isInverted = v.level.isInverted.getAndSetDefault(
    getPickupIndex(collectible),
  );
  fprint(
    `corruptItems: scanning pedestal of index ${getPickupIndex(
      collectible,
    )}, its ${isInverted ? "inverted" : "non-inverted"}`,
  );
  const actionSetOrUndefined = isInverted
    ? getInvertedItemActionSet(collectible.SubType)
    : getNormalItemActionSet(collectible.SubType);
  // Flip the pedestal orientation if it is inverted.
  if (isInverted) {
    collectible.FlipX = true;
  } else {
    collectible.FlipX = false;
  }
  // Set color.
  if (actionSetOrUndefined?.tags?.color !== undefined) {
    collectible.SetColor(actionSetOrUndefined.tags.color, 0, 1);
  } else {
    collectible.SetColor(ColorDefault, 0, 1);
  }
}

/** Scans all pedestals in the room. */
export function updatePedestalAppearanceInRoom(): void {
  getCollectibles().forEach((pedestal) => updatePedestalAppearance(pedestal));
}

/** Set one item to a specific inversion status. This will also update the pedestal. */
export function setItemInversion(
  desiredInversionStatus: boolean,
  collectible: EntityPickupCollectible,
): void {
  v.level.isInverted.set(getPickupIndex(collectible), desiredInversionStatus);
  updatePedestalAppearance(collectible);
}

/**
 * Sets all items on the floor to a specific inversion status. This will also update all pedestals
 * in the room.
 */
export function setAllItemsOnLevelInversion(
  desiredInversionStatus: boolean,
): void {
  v.level.isInverted.forEach((value, key) =>
    v.level.isInverted.set(key, desiredInversionStatus),
  );
  updatePedestalAppearanceInRoom();
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
  updatePedestalAppearanceInRoom();
}

/**
 * When the item goes into ItemQueue. If it's ZAZZ, transfers the ActionSet to the player.
 * TODO: Change to after it exits?
 */
export function corruptItemsPreItemPickupCollectible(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
): void {
  if (pickingUpItem.subType === CollectibleTypeCustom.ZAZZ) {
    fprint(
      `pickupInversion: ${getPlayerIndex(
        player,
      )} picked up inverted item of subType: ${defaultMapGetPlayer(
        v.run.currentlyPickingUpType,
        player,
      )}`,
    );
    addInvertedItemToPlayer(
      player,
      defaultMapGetPlayer(v.run.currentlyPickingUpType, player),
    );
  }
}

/**
 * Upon picking up an item, but before it is added to ItemQueue. If the item pedestal is inverted,
 * swap it for 'ZAZZ' right before its picked up.
 */
export function pickupInversionPreGetPedestalCollectible(
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
      `pickupInversion: ${getPlayerIndex(
        player,
      )} picked up an inverted item of subType: ${pickup.SubType}`,
    );
    defaultMapSetPlayer(v.run.currentlyPickingUpType, player, pickup.SubType);
    pickup.SubType = CollectibleTypeCustom.ZAZZ;
    return false;
  }
  return undefined;
}
