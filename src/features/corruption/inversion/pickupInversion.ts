/**
 * Keeps track of and manages the inversion status of pickups, more specifically pedestals. If a
 * pedestal spawns of unknown inversion status (e.g when first loading in), it is defaulted to the
 * current game inversion status. Also manages what happens when a player picks up an item with
 * corrupted effects.
 */

import {
  CollectibleType,
  EntityType,
  PickupVariant,
} from "isaac-typescript-definitions";
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
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/InvertedItemActionSet";
import { EID_ENTITY_DATA_KEY } from "../../../constants/eidConstants";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { fprint } from "../../../helper/printHelper";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { mod } from "../../../mod";
import { InvertedItemActionSetBuilder } from "../../../types/general/Builder";
import {
  addInvertedItemToPlayer,
  getAndSetInvertedItemActionSet,
  setInvertedItemActionSetIfNone,
} from "../effects/invertedItemEffects";
import { getNonInvertedPickupActionSet } from "../effects/pickupEffects";
import { isGameInverted } from "./playerInversion";

/**
 * Keeps track of and manages 'inverted items'. When an item spawns, the game checks if it should be
 * inverted or not by looking at the game inversion status. If the item should be inverted, inverts
 * it.
 */
// TODO: Update to track all pickup inversions.

const v = {
  run: {
    lastPickedUpInvertedCollectible: new DefaultMap<
      PlayerIndex,
      CollectibleType
    >(CollectibleType.SAD_ONION),
  },
  level: {
    /** Default pedestal inversion status is the current game inversion status. */
    isInverted: new DefaultMap<PickupIndex, boolean>(() => isGameInverted()),
  },
};

export function pickupInversionInit(): void {
  mod.saveDataManager("pickupInversion", v);
}

/** Check if the collectible entity is inverted. */
export function isPedestalInverted(
  collectible: EntityPickupCollectible,
): boolean {
  return v.level.isInverted.getAndSetDefault(mod.getPickupIndex(collectible));
}

/**
 * Update pedestal is unique from the 'update pickup' function in that it needs to take into account
 * the inversion status of the pickup.
 *
 * If the pedestal is non-inverted, it needs to be set to default appearance in case it was
 * originally inverted.
 */
export function updatePedestal(pedestal: EntityPickupCollectible): void {
  if (isPedestalInverted(pedestal)) {
    const invertedActionSet = getAndSetInvertedItemActionSet(pedestal.SubType);
    invertedActionSet.updateAppearance(pedestal);
  } else {
    const nonInvertedActionSet = getNonInvertedPickupActionSet(pedestal);
    if (nonInvertedActionSet === undefined) {
      pedestal.FlipX = false;
      pedestal.SetColor(ColorDefault, 0, 1);
      // TODO: Bad.
      pedestal.GetData()[EID_ENTITY_DATA_KEY] = EID?.getDescriptionData(
        EntityType.PICKUP,
        PickupVariant.COLLECTIBLE,
        pedestal.SubType,
      );
    } else {
      nonInvertedActionSet.updateAppearance(pedestal);
    }
  }
}

/**
 * Set one pedestal to a specific inversion status. This will also update the pedestal.
 *
 * @param actionSet Optional, will set the inverted items ActionSet if the item does not have an
 *                  ActionSet (does not DeepCopy).
 */
export function setPedestalInversion(
  inverted: boolean,
  collectible: EntityPickupCollectible,
  invertedItemActionSet?: InvertedItemActionSet,
): void {
  v.level.isInverted.set(mod.getPickupIndex(collectible), inverted);
  if (invertedItemActionSet !== undefined) {
    if (inverted) {
      setInvertedItemActionSetIfNone(
        collectible.SubType,
        invertedItemActionSet,
      );
    }
  }
  updatePedestal(collectible);
}

/** Scans all pedestals in the room. */
export function updatePedestalsInRoom(): void {
  getCollectibles().forEach((pedestal) => updatePedestal(pedestal));
}

/**
 * Sets all pedestals on the floor to a specific inversion status. This will also update all
 * pedestals in the room.
 *
 * @param inputs Optional, sets items in room ActionSet using specified builder if item does not
 *               already have an ActionSet.
 */
export function setAllPedestalsOnLevelInversion(
  inverted: boolean,
  generationIfEmpty?: InvertedItemActionSetBuilder,
  inputs?: ActionSetBuilderInput,
): void {
  getCollectibles().forEach((collectible) => {
    setPedestalInversion(inverted, collectible, generationIfEmpty?.(inputs));
  });
  v.level.isInverted.forEach((value, key) =>
    v.level.isInverted.set(key, inverted),
  );
}

/**
 * When the item goes into ItemQueue. If it is ZAZZ, it's an inverted item. Passive items get their
 * ActionSet triggered immediately, while Active item ActionSets go into the players' active slot
 * and can be triggered by the player.
 */
export function corruptItemsPreItemPickupCollectible(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
): void {
  if (pickingUpItem.subType === CollectibleTypeCustom.ZAZZ) {
    const pickedUpCollectibleType = defaultMapGetPlayer(
      v.run.lastPickedUpInvertedCollectible,
      player,
    );
    fprint(
      `pickupInversion: ${getPlayerIndex(
        player,
      )} picked up inverted item of subType: ${pickedUpCollectibleType}`,
    );
    addInvertedItemToPlayer(player, pickedUpCollectibleType, false);
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
    const itemActionSet = getAndSetInvertedItemActionSet(pickup.SubType);
    fprint(
      `pickupInversion: ${getPlayerIndex(
        player,
      )} picked up an inverted item of subType: ${pickup.SubType}`,
    );
    defaultMapSetPlayer(
      v.run.lastPickedUpInvertedCollectible,
      player,
      pickup.SubType,
    );
    // If it is a passive, change to passive 'ZAZZ', otherwise change to active 'ZAZZ' depending on
    // the charge type.
    if (itemActionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM) {
    } else {
      pickup.SubType = CollectibleTypeCustom.ZAZZ;
    }
    return false;
  }
  return undefined;
}
