import type { CollectibleType } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import { DefaultMap } from "isaacscript-common";
import type { ActionSet } from "../../../classes/corruption/actionSets/ActionSet";

const v = {
  run: {
    /** Ordered list of inverted passive items added to the player. */
    items: new DefaultMap<PlayerIndex, Array<[CollectibleType, ActionSet]>>(
      () => [],
    ),
  },
};

export function invertedItemCorruptInit(): void {
  // mod.saveDataManager("CorruptInventory", v);
}
