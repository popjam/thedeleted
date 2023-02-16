/**
 * Functions to do with setting a pedestal's inversion status. These functions will make sure to
 * update the pedestals as well.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibles } from "isaacscript-common";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import {
  _setAllPedestalInversion,
  _setPedestalInversion,
} from "../../../features/corruption/inversion/pickupInversion";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { InvertedItemActionSetBuilder } from "../../../types/general/Builder";
import { setInvertedItemActionSetIfNone } from "./itemEffects";
import { updatePedestal } from "./updateInverted";

/**
 * Set one pedestal to a specific inversion status. This will also update the pedestal.
 *
 * @param inverted
 * @param collectible
 * @param invertedItemActionSet Optional, will set the inverted items ActionSet if the item does not
 *                              have an ActionSet (does not DeepCopy).
 */
export function setPedestalInversion(
  inverted: boolean,
  collectible: EntityPickupCollectible,
  invertedItemActionSet?: InvertedItemActionSet,
): void {
  if (collectible.SubType === CollectibleType.NULL) {
    return;
  }

  _setPedestalInversion(inverted, collectible);
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

/**
 * Sets all pedestals on the floor to a specific inversion status. This will also update all
 * pedestals in the room.
 *
 * @param inverted
 * @param generationIfEmpty
 * @param inputs Optional, sets items in room ActionSet using specified builder if item does not
 *               already have an ActionSet.
 */
export function setAllPedestalsOnLevelInversion(
  inverted: boolean,
  generationIfEmpty?: InvertedItemActionSetBuilder,
  inputs?: ActionSetBuilderInput,
): void {
  getCollectibles().forEach((collectible) => {
    if (inputs !== undefined) {
      inputs.collectible = collectible.SubType;
    }
    setPedestalInversion(inverted, collectible, generationIfEmpty?.(inputs));
  });
  _setAllPedestalInversion(inverted);
}
