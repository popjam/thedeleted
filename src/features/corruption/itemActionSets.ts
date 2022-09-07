/**
 * Tracks ActionSets (and hence Actions) associated with CollectibleType. These can either be tied
 * to the inverted form or the normal form.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { saveDataManager } from "isaacscript-common";
import { ActionSet } from "../../interfaces/corruption/ActionSet";

const v = {
  run: {
    /**
     * ActionSets attached to collectibles which are on an inverted pedestal. Inverted collectibles
     * spawned with no ActionSets are automatically assigned an ActionSet through the correct
     * CorruptionDNA. Inverted collectibles with empty ActionSets are not touched.
     */
    invertedItems: new Map<CollectibleType, ActionSet>(),

    /**
     * Normal items with corrupted effects attached. Normal items do not spawn with default
     * ActionSets, and need to have them added manually through other means. On picking up the item,
     * the player will get any Actions as well as the normal item.
     */
    normalItems: new Map<CollectibleType, ActionSet>(),
  },
};

export function itemActionSetsInit(): void {
  saveDataManager("itemActionSets", v);
}
