/** Functions related to inverted item ActionSets (not player inventory passive ActionSets). */

import type { CollectibleType } from "isaac-typescript-definitions";
import type { Action } from "../../../classes/corruption/actions/Action";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import type { Response } from "../../../classes/corruption/responses/Response";
import {
  doesInvertedItemHaveActionSet,
  getAndSetInvertedItemActionSet,
  _setInvertedItemActionSet,
} from "../../../features/corruption/effects/itemEffects";
import { updatePedestalsInRoom } from "../inversion/updateInverted";

/**
 * If the inverted item does not already have an ActionSet attached to it, this function will attach
 * one.
 */
export function setInvertedItemActionSetIfNone(
  collectible: CollectibleType,
  actionSet: InvertedItemActionSet,
): void {
  if (!doesInvertedItemHaveActionSet(collectible)) {
    setInvertedItemActionSet(collectible, actionSet);
  }
}

/**
 * Add Actions or Responses to an Inverted Item. This will update all the pedestals in the room, as
 * inverted collectible ActionSets are shared between CollectibleTypes. This will NOT update
 * inverted items the player already has. Does not deepCopy!
 */
export function addEffectsToInvertedItem(
  collectible: CollectibleType,
  ...effects: Array<Response | Action>
): void {
  const invertedItemActionSet = getAndSetInvertedItemActionSet(collectible);
  invertedItemActionSet.addEffects(...effects);
  updatePedestalsInRoom();
}

/**
 * Sets the ActionSet for the inverted item. If the item already has an ActionSet, this will
 * override it. This will update all pedestals in the room, as inverted collectible ActionSets are
 * shared between CollectibleTypes.
 */
export function setInvertedItemActionSet(
  collectible: CollectibleType,
  actionSet: InvertedItemActionSet,
): void {
  _setInvertedItemActionSet(collectible, actionSet);
  updatePedestalsInRoom();
}
