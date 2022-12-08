import { CollectibleType } from "isaac-typescript-definitions";
import {
  DefaultMap,
  defaultMapGetPlayer,
  PlayerIndex,
} from "isaacscript-common";
import { mod } from "../../mod";

const v = {
  run: {
    /** Ordered list of inverted passive items added to the player. */
    passives: new DefaultMap<PlayerIndex, CollectibleType[]>(() => []),
  },
};

export function invertedItemCorruptInit(): void {
  mod.saveDataManager("CorruptInventory", v);
}

/**
 * Add an inverted item into the players' inventory tracker. This does not actually give the item to
 * the player, and should probably not get called outside specific functions.
 *
 * TODO: Update for actives.
 */
export function addInvertedItemToCorruptInventory(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  print("adding to inventory");
  defaultMapGetPlayer(v.run.passives, player).push(collectibleType);
}
