import {
  getConstituentsFromEntityID,
  getRandomFromWeightedArray,
  getRandomSeed,
  getRandomSetElement,
  isRune,
  spawnPickup,
} from "isaacscript-common";
import type { ReadonlySet, EntityID } from "isaacscript-common";
import { EntityCategory } from "../../enums/general/EntityCategory";
import {
  getEntityIDSetFromCategory,
  getModdedEntityIDSetFromCategory,
  getModdedPickupIDSetOfPickupType,
  getNonModdedEntityIDSetFromCategory,
  getNonModdedPickupIDSetOfPickupType,
  getPickupIDSetOfPickupType,
} from "../../features/data/gameSets/gameEntitySets";
import type { PickupID } from "../../enums/data/ID/PickupID";
import { getNonModdedPickupName } from "../../maps/data/name/pickupNameMap";
import { getNameSubTypeFromModdedEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import { getModdedEntityNameAndSubTypeFromNameSubType } from "./entityIDHelper";
import { PickupType } from "../../enums/general/PickupType";
import { fprint } from "../printHelper";
import type { CardType } from "isaac-typescript-definitions";
import { EntityType, PickupVariant } from "isaac-typescript-definitions";
import {
  RANDOM_SOFT_NON_MODDED_MISCELLANEOUS_PICKUP_ID_SPREAD,
  RANDOM_SOFT_NON_MODDED_RUNE_PICKUP_ID_SPREAD,
  RANDOM_SOFT_NON_MODDED_SOUL_PICKUP_ID_SPREAD,
  SOUL_PREFIX,
} from "../../constants/pickupConstants";

/**
 * Determines if a EntityID that refers to a pickup is modded by checking it against the set of all
 * non-modded PickupIDs.
 */
export function isPickupIDModded(pickupID: PickupID): boolean {
  const nonModdedPickupSet = getNonModdedEntityIDSetFromCategory(
    EntityCategory.PICKUP,
  );
  return !nonModdedPickupSet.has(pickupID as EntityID);
}

/**
 * Get the name of a PickupID. If it is modded, and the mod is not tracked, this will return
 * undefined. For modded pickups, this is the same as its 'name' xml attribute.
 */
export function getPickupIDName(pickupID: PickupID): string | undefined {
  const modded = isPickupIDModded(pickupID);
  if (!modded) {
    return getNonModdedPickupName(pickupID);
  }

  const nameSubType = getNameSubTypeFromModdedEntityID(pickupID as EntityID);
  if (nameSubType === undefined) {
    return undefined;
  }

  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType).name;
}

/**
 * Retrieves a random PickupID from the pool of available PickupIDs from the game set.
 *
 * @param modded Whether to get a modded or non-modded PickupID. If undefined, will get a random
 *               PickupID from either. If there are no modded PickupIDs with this set to true, this
 *               will return undefined.
 * @param seedOrRNG The seed or RNG to use for randomization. If undefined, will use undefined.
 */
export function getRandomPickupID(
  modded: boolean | undefined = undefined,
  seedOrRNG: Seed | RNG | undefined = undefined,
): PickupID | undefined {
  if (modded === undefined) {
    const pickupIDSet = getEntityIDSetFromCategory<PickupID>(
      EntityCategory.PICKUP,
    );
    return getRandomSetElement(pickupIDSet, seedOrRNG);
  }

  if (modded) {
    const pickupIDSet = getModdedEntityIDSetFromCategory<PickupID>(
      EntityCategory.PICKUP,
    );
    if (pickupIDSet.size === 0) {
      fprint("No modded PickupIDs found!");
      return undefined;
    }
    return getRandomSetElement(pickupIDSet, seedOrRNG);
  }

  const pickupIDSet = getNonModdedEntityIDSetFromCategory<PickupID>(
    EntityCategory.PICKUP,
  );

  return getRandomSetElement(pickupIDSet, seedOrRNG);
}

/**
 * Retrieves a random PickupID that corresponds to the specified PickupType using the game PickupID
 * sets. If no PickupID is found, this will return undefined.
 *
 * @param pickupType The PickupType to get a random PickupID from.
 * @param seedOrRNG The seed or RNG to use for randomization.
 * @param modded Whether to get a modded or non-modded PickupID. If undefined, will get a random
 *               PickupID from either.
 */
export function getRandomPickupIDFromPickupType(
  pickupType: PickupType,
  seedOrRNG: Seed | RNG = getRandomSeed(),
  modded: boolean | undefined = undefined,
): PickupID | undefined {
  let pickupIDSet: ReadonlySet<PickupID> | undefined;
  if (modded === undefined) {
    pickupIDSet = getPickupIDSetOfPickupType(pickupType);
  } else if (modded) {
    pickupIDSet = getModdedPickupIDSetOfPickupType(pickupType);
  } else {
    pickupIDSet = getNonModdedPickupIDSetOfPickupType(pickupType);
  }

  if (pickupIDSet.size === 0) {
    fprint(
      `No PickupIDs found for PickupType ${PickupType[pickupType]}${
        modded === undefined ? "" : ` and modded = ${modded ? "true" : "false"}`
      }`,
    );
    return undefined;
  }

  return getRandomSetElement(pickupIDSet, seedOrRNG);
}

/**
 * Spawn an Pickup by using their PickupID. If the specified PickupID does not refer to a Pickup,
 * this will throw an error.
 */
export function spawnPickupID(
  pickupID: PickupID,
  positionOrGridIndex: Vector | int,
  velocity?: Vector,
  spawner?: Entity | undefined,
  seedOrRNG?: Seed | RNG | undefined,
): EntityPickup {
  const constituents = getConstituentsFromEntityID(pickupID as EntityID);
  if (constituents[0] !== EntityType.PICKUP) {
    error(`spawnPickupID: EntityID ${pickupID} is not a PickupID`);
  }

  return spawnPickup(
    constituents[1],
    constituents[2],
    positionOrGridIndex,
    velocity,
    spawner,
    seedOrRNG,
  );
}

/**
 * Retrieves the PickupID that will spawn a random pickup of the specified type. If the specified
 * PickupType does not have a corresponding random PickupID, this will generate a random specific
 * PickupID of that type.
 */
export function getSoftRandomPickupIDFromPickupType(
  pickupType: PickupType,
  seedOrRNG: Seed | RNG | undefined = undefined,
): PickupID {
  switch (pickupType) {
    case PickupType.HEART: {
      return `${EntityType.PICKUP}.${PickupVariant.HEART}.0` as PickupID;
    }

    case PickupType.COIN: {
      return `${EntityType.PICKUP}.${PickupVariant.COIN}.0` as PickupID;
    }

    case PickupType.KEY: {
      return `${EntityType.PICKUP}.${PickupVariant.KEY}.0` as PickupID;
    }

    case PickupType.BOMB: {
      return `${EntityType.PICKUP}.${PickupVariant.BOMB}.0` as PickupID;
    }

    case PickupType.POOP: {
      return `${EntityType.PICKUP}.${PickupVariant.POOP}.0` as PickupID;
    }

    // This will spawn a random chest.
    case PickupType.CHEST: {
      return `${EntityType.PICKUP}.${PickupVariant.CHEST}.0` as PickupID;
    }

    case PickupType.SACK: {
      return `${EntityType.PICKUP}.${PickupVariant.SACK}.0` as PickupID;
    }

    case PickupType.PILL: {
      return `${EntityType.PICKUP}.${PickupVariant.PILL}.0` as PickupID;
    }

    case PickupType.BATTERY: {
      return `${EntityType.PICKUP}.${PickupVariant.LIL_BATTERY}.0` as PickupID;
    }

    case PickupType.COLLECTIBLE: {
      return `${EntityType.PICKUP}.${PickupVariant.COLLECTIBLE}.0` as PickupID;
    }

    case PickupType.TRINKET: {
      return `${EntityType.PICKUP}.${PickupVariant.TRINKET}.0` as PickupID;
    }

    case PickupType.SHOP_ITEM: {
      return `${EntityType.PICKUP}.${PickupVariant.SHOP_ITEM}.0` as PickupID;
    }

    // Can spawn runes and souls.
    case PickupType.CARD: {
      return `${EntityType.PICKUP}.${PickupVariant.CARD}.0` as PickupID;
    }

    case PickupType.SOUL: {
      return getRandomFromWeightedArray(
        RANDOM_SOFT_NON_MODDED_SOUL_PICKUP_ID_SPREAD,
        seedOrRNG,
      );
    }

    case PickupType.RUNE: {
      return getRandomFromWeightedArray(
        RANDOM_SOFT_NON_MODDED_RUNE_PICKUP_ID_SPREAD,
        seedOrRNG,
      );
    }

    case PickupType.MISCELLANEOUS: {
      return getRandomFromWeightedArray(
        RANDOM_SOFT_NON_MODDED_MISCELLANEOUS_PICKUP_ID_SPREAD,
        seedOrRNG,
      );
    }
  }
}

export function getPickupTypeFromPickupID(pickupID: PickupID): PickupType {
  const constituents = getConstituentsFromEntityID(pickupID as EntityID);
  if (constituents[0] !== EntityType.PICKUP) {
    error(`EntityID ${pickupID} is not a PickupID`);
  }

  switch (constituents[1]) {
    case PickupVariant.HEART: {
      return PickupType.HEART;
    }

    case PickupVariant.COIN: {
      return PickupType.COIN;
    }

    case PickupVariant.KEY: {
      return PickupType.KEY;
    }

    case PickupVariant.BOMB: {
      return PickupType.BOMB;
    }

    case PickupVariant.THROWABLE_BOMB: {
      return PickupType.BOMB;
    }

    case PickupVariant.POOP: {
      return PickupType.POOP;
    }

    case PickupVariant.CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.SACK: {
      return PickupType.SACK;
    }

    case PickupVariant.PILL: {
      return PickupType.PILL;
    }

    case PickupVariant.BOMB_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.LOCKED_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.ETERNAL_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.HAUNTED_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.RED_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.MIMIC_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.MEGA_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.BIG_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.SPIKED_CHEST: {
      return PickupType.CHEST;
    }

    case PickupVariant.LIL_BATTERY: {
      return PickupType.BATTERY;
    }

    case PickupVariant.COLLECTIBLE: {
      return PickupType.COLLECTIBLE;
    }

    case PickupVariant.TRINKET: {
      return PickupType.TRINKET;
    }

    case PickupVariant.SHOP_ITEM: {
      return PickupType.SHOP_ITEM;
    }

    case PickupVariant.CARD: {
      const cardName = getPickupIDName(pickupID);
      if (cardName === undefined) {
        return PickupType.CARD;
      }

      // If the card name has 'Soul of' in it, it's a soul stone.
      if (cardName.toLowerCase().includes(SOUL_PREFIX.toLowerCase())) {
        return PickupType.SOUL;
      }

      if (isRune(constituents[2] as CardType)) {
        return PickupType.RUNE;
      }

      return PickupType.CARD;
    }

    default: {
      // Check if name contains 'Chest'.
      const pickupName = getPickupIDName(pickupID);
      if (
        pickupName !== undefined &&
        pickupName.toLowerCase().includes("chest")
      ) {
        return PickupType.CHEST;
      }
      return PickupType.MISCELLANEOUS;
    }
  }
}
