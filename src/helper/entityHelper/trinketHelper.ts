import type { TrinketType } from "isaac-typescript-definitions";
import {
  getModdedPickupIDSetOfPickupType,
  getNonModdedPickupIDSetOfPickupType,
  getPickupIDSetOfPickupType,
} from "../../features/data/gameSets/gameSets";
import { PickupType } from "../../enums/general/PickupType";
import type { EntityID } from "isaacscript-common";
import {
  getConstituentsFromEntityID,
  getPlayerTrinkets,
  getRandomSetElement,
} from "isaacscript-common";
import type { PickupID } from "../../enums/data/ID/PickupID";
import { fprint } from "../printHelper";

/**
 * Gets a random TrinketType from the game set of all TrinketTypes.
 *
 * @param modded Whether to get a modded TrinketType (true), a non-modded TrinketType (false), or
 *               either (undefined). Defaults to undefined.
 * @param seedOrRNG The seed or RNG to use for randomness. Defaults to a random undefined.
 *
 * @returns A random TrinketType from the game set of all TrinketTypes, or undefined if there are no
 *          TrinketTypes in the game set (e.g if there are no mods and modded is true).
 */
export function getRandomTrinket(
  modded: boolean | undefined = undefined,
  seedOrRNG: Seed | RNG | undefined = undefined,
): TrinketType | undefined {
  let trinkets: ReadonlySet<PickupID> | undefined;
  if (modded === undefined) {
    trinkets = getPickupIDSetOfPickupType(PickupType.TRINKET);
  } else if (modded) {
    trinkets = getModdedPickupIDSetOfPickupType(PickupType.TRINKET);
  } else {
    trinkets = getNonModdedPickupIDSetOfPickupType(PickupType.TRINKET);
  }

  if (trinkets.size === 0) {
    fprint(`getRandomTrinket: No trinkets found for modded value ${modded}.`);
    return undefined;
  }

  const trinketEntityID = getRandomSetElement(trinkets, seedOrRNG);
  const constituents = getConstituentsFromEntityID(trinketEntityID as EntityID);
  return constituents[2];
}

/** Returns true if the player is holding any trinkets. Does not count gulped trinkets. */
export function isPlayerHoldingTrinkets(player: EntityPlayer): boolean {
  return getPlayerTrinkets(player).length > 0;
}
