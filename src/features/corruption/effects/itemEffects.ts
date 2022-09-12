/**
 * Tracks ActionSets (and hence Actions) associated with CollectibleType. Every item can only have
 * one ActionSet. These can either be tied to the inverted form or the normal form.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { DefaultMap, saveDataManager } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { ActionSet } from "../../../interfaces/corruption/actionSets/ActionSet";
import { addActionSetToPlayer } from "../actionSets/actionSets";
import { getGameCorruptionDNA } from "../inversion/playerInversion";
import { generateActionSet } from "./effectGeneration";

/** Generates ActionSet */
const factoryFunction = (): ActionSet =>
  generateActionSet(getGameCorruptionDNA());

const v = {
  run: {
    /**
     * ActionSets attached to collectibles which are on an inverted pedestal. Inverted collectibles
     * spawned with no ActionSets are automatically assigned an ActionSet through the games'
     * CorruptionDNA. Inverted collectibles with empty ActionSets are not modified.
     */
    invertedItems: new DefaultMap<CollectibleType, ActionSet>(factoryFunction),

    /**
     * Normal items with corrupted effects attached. Normal items do not spawn with default
     * ActionSets, and need to have them added manually through other means. On picking up the item,
     * the player will get any Actions as well as get the normal item.
     */
    normalItems: new Map<CollectibleType, ActionSet>(),
  },
};

export function itemEffectsInit(): void {
  saveDataManager("itemEffects", v);
}

/** Get the ActionSet attached to the inverted version of the item. */
export function getInvertedItemActionSet(
  collectibleType: CollectibleType,
): ActionSet {
  return v.run.invertedItems.getAndSetDefault(collectibleType);
}

/** Get the ActionSet attached to the normal item. If it has no ActionSet, returns undefined. */
export function getNormalItemActionSet(
  collectibleType: CollectibleType,
): ActionSet | undefined {
  return v.run.normalItems.get(collectibleType);
}

/**
 * Adds the Actions attached to the Inverted Items ActionSet to the player. Optional parameter to
 * add a 'warning' logo (to the item tracker).
 */
export function addInvertedItemToPlayer(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  addLogo = false,
): void {
  addActionSetToPlayer(player, getInvertedItemActionSet(collectibleType));
  if (addLogo) {
    player.AddCollectible(CollectibleTypeCustom.ZAZZ);
  }
}
