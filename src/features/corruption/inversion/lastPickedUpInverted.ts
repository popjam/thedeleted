/** This file tracks the last picked up inverted collectible that each player has picked up. */

import { CollectibleType } from "isaac-typescript-definitions";
import { DefaultMap, getPlayerIndex, PlayerIndex } from "isaacscript-common";
import { mod } from "../../../mod";

const v = {
  run: {
    lastPickedUpInvertedCollectible: new DefaultMap<
      PlayerIndex,
      CollectibleType
    >(CollectibleType.SAD_ONION),
  },
};

export function lastPickedUpInvertedCollectibleInit(): void {
  mod.saveDataManager("lastPickedUpInvertedCollectible", v);
}

/** Get the last inverted collectible that the player picked up. */
export function getLastPickedUpInvertedCollectible(
  player: EntityPlayer,
): CollectibleType {
  return v.run.lastPickedUpInvertedCollectible.getAndSetDefault(
    getPlayerIndex(player),
  );
}

/** Set the last inverted collectible that the player picked up. */
export function setLastPickedUpInvertedCollectible(
  player: EntityPlayer,
  collectible: CollectibleType,
): void {
  v.run.lastPickedUpInvertedCollectible.set(
    getPlayerIndex(player),
    collectible,
  );
}
