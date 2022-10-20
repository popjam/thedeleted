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
  getPlayerIndex,
  PickingUpItemCollectible,
  PickupIndex,
  PlayerIndex,
} from "isaacscript-common";
import { ActionSet } from "../../../classes/corruption/actionSets/ActionSet";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { fprint } from "../../../helper/printHelper";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { mod } from "../../../mod";
import { ActionSetBuilder } from "../../../types/general/Builder";
import {
  addInvertedItemToPlayer,
  getAndSetInvertedItemActionSet,
  getNormalItemActionSet,
  setInvertedItemActionSetIfNone,
  setNormalItemActionSetIfNone,
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
  mod.saveDataManager("pickupInversion", v);
}

/** Every time a pedestal spawns, scan it. */
export function pickupInversionPostPickupInitLate(
  pickup: EntityPickupCollectible,
): void {
  fprint(
    `pickupInversion: pedestal init, of pickup index: ${mod.getPickupIndex(
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
    mod.getPickupIndex(collectible),
  );
  fprint(
    `corruptItems: scanning pedestal of index ${mod.getPickupIndex(
      collectible,
    )}, its ${isInverted ? "inverted" : "non-inverted"}`,
  );
  const actionSetOrUndefined = isInverted
    ? getAndSetInvertedItemActionSet(collectible.SubType)
    : getNormalItemActionSet(collectible.SubType);
  // Flip the pedestal orientation if it is inverted.
  if (isInverted) {
    collectible.FlipX = true;
  } else {
    collectible.FlipX = false;
  }
  // Set color.
  if (actionSetOrUndefined !== undefined) {
    const color = actionSetOrUndefined.getColor();
    collectible.SetColor(color, 0, 1);
  } else {
    collectible.SetColor(ColorDefault, 0, 1);
  }
}

/** Scans all pedestals in the room. */
export function updatePedestalAppearanceInRoom(): void {
  getCollectibles().forEach((pedestal) => updatePedestalAppearance(pedestal));
}

/**
 * Set one pedestal to a specific inversion status. This will also update the pedestal.
 *
 * @param actionSet Optional, will set the items ActionSet if the item does not have an ActionSet
 *                  (does not DeepCopy).
 */
export function setPedestalInversion(
  desiredInversionStatus: boolean,
  collectible: EntityPickupCollectible,
  actionSet?: ActionSet,
): void {
  v.level.isInverted.set(
    mod.getPickupIndex(collectible),
    desiredInversionStatus,
  );
  if (actionSet !== undefined) {
    setPedestalActionSetIfNone(collectible, actionSet);
  }
  updatePedestalAppearance(collectible);
}

/**
 * Sets all pedestals on the floor to a specific inversion status. This will also update all
 * pedestals in the room.
 *
 * @param corruptionDNA Optional, sets items in room ActionSet using specified CorruptionDNA if item
 *                      does not already have an ActionSet.
 */
export function setAllPedestalsOnLevelInversion(
  desiredInversionStatus: boolean,
  generationIfEmpty?: ActionSetBuilder,
  inputs?: ActionSetBuilderInput,
): void {
  getCollectibles().forEach((collectible) => {
    setPedestalInversion(
      desiredInversionStatus,
      collectible,
      generationIfEmpty?.(inputs),
    );
  });
  v.level.isInverted.forEach((value, key) =>
    v.level.isInverted.set(key, desiredInversionStatus),
  );
}

/**
 * Sets the pedestal's item's ActionSet if the item does not have an ActionSet already. Works on
 * inverted and non-inverted pedestals. Does not DeepCopy.
 */
export function setPedestalActionSetIfNone(
  pickup: EntityPickupCollectible,
  actionSet: ActionSet,
): void {
  if (v.level.isInverted.getAndSetDefault(mod.getPickupIndex(pickup))) {
    setInvertedItemActionSetIfNone(pickup.SubType, actionSet);
  } else {
    setNormalItemActionSetIfNone(pickup.SubType, actionSet);
  }
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
  const pickupIndex = mod.getPickupIndex(pickup);
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
