import { getRandomSeed, getRandomSetElement } from "isaacscript-common";
import type { EntityID } from "isaacscript-common";
import { EntityCategory } from "../../enums/general/EntityCategory";
import {
  getEntityIDSetFromCategory,
  getModdedEntityIDSetFromCategory,
  getNonModdedEntityIDSetFromCategory,
} from "../../features/data/gameSets/gameEntitySets";
import type { EffectID } from "../../enums/data/ID/EffectID";
import { getNameSubTypeFromModdedEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import { getModdedEntityNameAndSubTypeFromNameSubType } from "./entityIDHelper";
import { fprint } from "../printHelper";

/**
 * Determines if a EntityID that refers to an effect is modded by checking it against the set of all
 * non-modded EffectIDs.
 */
export function isEffectIDModded(effectID: EffectID): boolean {
  const nonModdedEffectSet = getNonModdedEntityIDSetFromCategory(
    EntityCategory.EFFECT,
  );
  return !nonModdedEffectSet.has(effectID as EntityID);
}

/**
 * Get the name of an EffectID. If it is modded, and the mod is not tracked, this will return
 * undefined. For modded effects, this is the same as its 'name' xml attribute.
 */
export function getEffectIDName(effectID: EffectID): string | undefined {
  const modded = isEffectIDModded(effectID);
  if (!modded) {
    return undefined;
  }

  const nameSubType = getNameSubTypeFromModdedEntityID(effectID as EntityID);
  if (nameSubType === undefined) {
    return undefined;
  }

  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType).name;
}

/**
 * Retrieves a random EffectID from the pool of available EffectID from the game set.
 *
 * @param modded Whether to get a modded or non-modded EffectID. If undefined, will get a random
 *               EffectID from either. If there are no modded EffectID with this set to true, this
 *               will return undefined.
 * @param seedOrRNG The seed or RNG to use for randomization. If undefined, will use a random Seed.
 */
export function getRandomEffectID(
  modded: boolean | undefined = undefined,
  seedOrRNG: Seed | RNG = getRandomSeed(),
): EffectID | undefined {
  if (modded === undefined) {
    const effectIDSet = getEntityIDSetFromCategory<EffectID>(
      EntityCategory.EFFECT,
    );
    return getRandomSetElement(effectIDSet, seedOrRNG);
  }

  if (modded) {
    const effectIDSet = getModdedEntityIDSetFromCategory<EffectID>(
      EntityCategory.EFFECT,
    );
    if (effectIDSet.size === 0) {
      fprint("No modded PickupIDs found!");
      return undefined;
    }
    return getRandomSetElement(effectIDSet, seedOrRNG);
  }

  const effectIDSet = getNonModdedEntityIDSetFromCategory<EffectID>(
    EntityCategory.EFFECT,
  );

  return getRandomSetElement(effectIDSet, seedOrRNG);
}
