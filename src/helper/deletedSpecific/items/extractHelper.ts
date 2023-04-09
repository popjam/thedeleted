import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  DefaultMap,
  WeightedArray,
  copyColor,
  getRandomFromWeightedArray,
  isCollectible,
  sfxManager,
} from "isaacscript-common";
import {
  isPickupUnstable,
  setEntityInstability,
} from "../../../classes/facets/entityModifiers.ts/UnstableEntityFacet";
import { isPickupInverted } from "../../../features/corruption/inversion/pickupInversion";
import { getPickupExtractExplosionDmg } from "../../../maps/modes/ZIPBOMBER/extractPickupBurnTimeMap";
import { Percentage, rollPercentage } from "../../../types/general/Percentage";
import { Range, randomInRangeOrNumber } from "../../../types/general/Range";
import { extractResponseBuilder } from "../../builders/items/EXTRACTBuilders";
import { rerollCollectible } from "../../collectibleHelper";
import { reddenColor } from "../../colorHelper";
import { explodeEntity } from "../../entityHelper/explodeEntity";
import { isUselessPickup } from "../../pickupHelper";
import { fprint } from "../../printHelper";
import { setPedestalInversion } from "../inversion/pedestalInversion";
import { getAndSetNonInvertedPickupActionSet } from "../inversion/pickupEffects";

const BASE_PICKUP_EXPLOSION_DMG = 20;
const EXTRACT_COLLECTIBLE_SOUND = SoundEffect.MATCHSTICK;
const EXTRACT_SOUND_INCREMENT = 0.4;

const COLLECTIBLE_EXTRACTIONS_TIL_EXPLODE_CHANCE = new DefaultMap<
  number,
  Percentage
>(90, [
  [1, 5], // On the first extraction.
  [2, 25],
  [3, 40],
  [4, 50],
  [5, 65],
  [6, 80],
]);

// eslint-disable-next-line isaacscript/require-capital-const-assertions, isaacscript/require-capital-read-only
const SECONDS_TO_EXPLODE_AFTER_EXTRACTION: WeightedArray<number | Range> = [
  [1, 0.9],
  [[2, 9], 0.1],
  [[1, 60], 0.01],
];

/**
 * Rerolls the collectible, adding a negative effect to it. If the item is an inverted item, it will
 * reroll into another inverted item while still adding a negative effect.
 */
export function extractCollectible(collectible: EntityPickupCollectible): void {
  if (isPickupUnstable(collectible)) {
    return;
  }

  const isInverted = isPickupInverted(collectible);
  fprint(`Extracting a collectible. Is inverted: ${isInverted}.`);
  if (isInverted) {
    /** Set to non-inverted. */
    setPedestalInversion(false, collectible);
  }

  /** Shape the NonInvertedPickupActionSet. */
  const nonInvertedActionSet = getAndSetNonInvertedPickupActionSet(collectible);
  // Increment the number of times this item has been extracted.
  nonInvertedActionSet.ext =
    nonInvertedActionSet.ext === undefined ? 1 : nonInvertedActionSet.ext + 1;
  nonInvertedActionSet.addEffects(extractResponseBuilder());
  const color = copyColor(collectible.GetColor());
  nonInvertedActionSet.setColor(reddenColor(color));

  rerollCollectible(collectible);

  /** Play sound. */
  sfxManager.Play(
    EXTRACT_COLLECTIBLE_SOUND,
    1,
    0,
    false,
    nonInvertedActionSet.ext * EXTRACT_SOUND_INCREMENT + 1,
  );

  /** Explode pickup. */
  const chanceToExplode =
    COLLECTIBLE_EXTRACTIONS_TIL_EXPLODE_CHANCE.getAndSetDefault(
      nonInvertedActionSet.ext,
    );
  if (rollPercentage(chanceToExplode)) {
    fprint(
      `Exploding collectible after ${nonInvertedActionSet.ext} extractions, with a ${chanceToExplode}% chance.`,
    );
    setEntityInstability(
      collectible,
      randomInRangeOrNumber(
        getRandomFromWeightedArray(SECONDS_TO_EXPLODE_AFTER_EXTRACTION),
      ),
    );
  }
}

/** Explodes the pickup. Does different things depending on the pickup extracted. */
export function extractPickup(pickup: EntityPickup): void {
  if (isCollectible(pickup)) {
    /** Exception to blow up empty pedestals, which can help kill enemies. */
    if (pickup.SubType === CollectibleType.NULL) {
      explodeEntity(pickup, BASE_PICKUP_EXPLOSION_DMG);
      return;
    }
    extractCollectible(pickup);
    return;
  }

  if (isUselessPickup(pickup)) {
    fprint("Can't extract a useless pickup.");
    return;
  }

  fprint("Extracting a non-collectible pickup.");
  explodeEntity(pickup, getPickupExtractExplosionDmg(pickup));
}
