import type {
  CollectibleType,
  PickupVariant,
} from "isaac-typescript-definitions";
import { spawnCollectible, spawnPickup } from "isaacscript-common";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import type { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { mod } from "../../../mod";
import { spawnGlitchedCollectible } from "../../collectibleHelper";
import { setPedestalInversion } from "./pedestalInversion";
import { setNonInvertedPickupActionSet } from "../effects/pickupEffects";
import { setInvertedItemActionSet } from "../effects/itemEffects";
import { getGameInvertedItemActionSet } from "../generation/corruptionGeneration";

/**
 * Spawns an Inverted collectible with a fresh TMTRAINER subType. This guarantees (mostly) that the
 * generated ActionSet will be completely new. Can specify an ActionSet to use for the item.
 *
 * Does not deepCopy! Once the game has generated >1024 tmtrainer collectibles, this will only
 * return repeat collectibles. The new repeat collectibles will automatically overwrite the old
 * ones.
 *
 * @param position The position to spawn the collectible at.
 * @param invertedActionSet The ActionSet to use for the item. If not specified, a new ActionSet
 *                          will be generated using the game generator.
 * @param inputs The inputs to use for the ActionSetBuilder. If an ActionSet is specified, this
 *               parameter is ignored.
 */
export function spawnNewInvertedCollectible(
  position: Vector,
  invertedActionSet?: InvertedItemActionSet,
  inputs?: ActionSetBuilderInput,
): EntityPickupCollectible {
  const tmtrainerCollectible = spawnGlitchedCollectible(position);

  // We create the ActionSet before inverting it, to ensure it always overrides the existing one.
  setInvertedItemActionSet(
    tmtrainerCollectible.SubType,
    invertedActionSet ?? getGameInvertedItemActionSet(inputs),
  );
  setPedestalInversion(true, tmtrainerCollectible);
  return tmtrainerCollectible;
}

/**
 * Spawns an Inverted Active item with a fresh TMTRAINER subType. This guarantees (mostly) that the
 * generated ActionSet will be completely new. Can specify an ActionSet to use for the item.
 *
 * Does not deepCopy!
 *
 * @param position The position to spawn the collectible at.
 * @param invertedActionSet The ActionSet to use for the item. If not specified, a new ActionSet
 *                          will be generated. Must be InvertedActiveActionSet.
 * @param inputs The inputs to use for the ActionSetBuilder. Will force 'forceActiveOrPassive' value
 *               to true if does not exist.
 */
export function spawnNewInvertedActiveCollectible(
  position: Vector,
  invertedActionSet?: InvertedActiveActionSet,
  inputs?: ActionSetBuilderInput,
): EntityPickupCollectible {
  inputs ??= {};
  inputs.forceActiveOrPassive = true;
  return spawnNewInvertedCollectible(position, invertedActionSet, inputs);
}

/**
 * Spawns an inverted pedestal, with an optional parameter for a custom ActionSet. Does not deepCopy
 * the ActionSet, or override an existing ActionSet associated with the collectible.
 *
 * @param position The position to spawn the collectible at.
 * @param collectibleType The inverted collectible you want to spawn.
 * @param invertedActionSet The ActionSet to use for the item if it does not already exist. If not
 *                          specified, a new ActionSet will be generated.
 * @param inputs The inputs to use for the ActionSetBuilder. If an ActionSet is specified, this
 *               parameter is ignored.
 */
export function spawnInvertedCollectible(
  position: Vector,
  collectibleType: CollectibleType,
  invertedActionSet?: InvertedItemActionSet,
  inputs?: ActionSetBuilderInput,
): EntityPickup {
  const pedestal = spawnCollectible(collectibleType, position, undefined);
  setPedestalInversion(true, pedestal, invertedActionSet, inputs);
  return pedestal;
}

/** Spawns a pickup with an ActionSet attached to it. */
export function spawnPickupWithEffects(
  pickupVariant: PickupVariant,
  subType: number,
  position: Vector,
  actionSet: NonInvertedPickupActionSet,
): EntityPickup {
  const pickup = spawnPickup(pickupVariant, subType, position);
  setNonInvertedPickupActionSet(pickup, actionSet);
  return pickup;
}
