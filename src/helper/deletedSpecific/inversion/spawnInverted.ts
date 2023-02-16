import { CollectibleType, PickupVariant } from "isaac-typescript-definitions";
import { spawnPickup } from "isaacscript-common";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { mod } from "../../../mod";
import { spawnGlitchedCollectible } from "../../collectibleHelper";
import { setPedestalInversion } from "./pedestalInversion";
import { setNonInvertedPickupActionSet } from "./pickupEffects";

/**
 * Spawns an Inverted collectible with a fresh TMTRAINER subType. This guarantees (mostly) that the
 * generated ActionSet will be completely new. Can specify an ActionSet to use for the item.
 */
export function spawnNewInvertedCollectible(
  position: Vector,
  invertedActionSet?: InvertedItemActionSet,
): EntityPickupCollectible {
  const tmtrainerCollectible = spawnGlitchedCollectible(position);
  setPedestalInversion(true, tmtrainerCollectible, invertedActionSet);
  return tmtrainerCollectible;
}

/**
 * Spawns an inverted pedestal, with an optional parameter for a custom ActionSet. Does not deepCopy
 * the ActionSet!
 */
export function spawnInvertedCollectible(
  position: Vector,
  collectibleType: CollectibleType,
  invertedActionSet?: InvertedItemActionSet,
): EntityPickup {
  const pedestal = mod.spawnCollectible(collectibleType, position);
  setPedestalInversion(true, pedestal, invertedActionSet);
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
