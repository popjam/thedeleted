/** Functions revolving around inverted active items. */

import { ActiveSlot } from "isaac-typescript-definitions";
import { VectorZero } from "isaacscript-common";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { getAndSetInvertedItemActionSet } from "../../../features/corruption/effects/itemEffects";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { isInvertedPassiveActionSet } from "../actionSetHelper";
import { spawnNewInvertedActiveCollectible } from "./spawnInverted";
import { addInvertedItemActionSetToPlayer } from "./playerItemEffects";

export function addNewInvertedActiveToPlayer(
  player: EntityPlayer,
  slot:
    | ActiveSlot.PRIMARY
    | ActiveSlot.POCKET
    | ActiveSlot.POCKET_SINGLE_USE = ActiveSlot.PRIMARY,
  invertedActionSet?: InvertedActiveActionSet,
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const newInvertedPedestal = spawnNewInvertedActiveCollectible(
    VectorZero,
    invertedActionSet,
    inputs,
  );
  newInvertedPedestal.Remove();
  const actionSet = getAndSetInvertedItemActionSet(newInvertedPedestal.SubType);
  if (isInvertedPassiveActionSet(actionSet)) {
    error("Error: The new inverted item is a passive item..");
  }
  addInvertedItemActionSetToPlayer(
    player,
    actionSet,
    true,
    true,
    newInvertedPedestal.SubType,
    slot,
  );
  return actionSet;
}
