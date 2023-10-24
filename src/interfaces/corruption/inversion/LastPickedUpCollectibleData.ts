import type { CollectibleType } from "isaac-typescript-definitions";
import type { PickupIndex } from "isaacscript-common";
import type { PickupStage } from "../../../enums/general/PickupStage";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";

/**
 * Data related to the last picked up / currently being picked up collectible, used by the inverted
 * collectible system.
 */
export interface LastPickedUpCollectibleData {
  collectibleType: CollectibleType;
  pickupStage: PickupStage;
  pickupIndex: PickupIndex;
  inverted: boolean;
  pedestal: EntityPickupCollectible;
  actionSet?: InvertedItemActionSet;
  nonInvertedCharge?: number;
}
