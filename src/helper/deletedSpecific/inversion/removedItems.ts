import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibleName, setCollectibleSubType } from "isaacscript-common";
import { _getRemovedInvertedItems } from "../../../features/corruption/inventory/removedInvertedItems";
import { isZazzinatorAny } from "../../../sets/zazzSets";
import { fprint } from "../../printHelper";
import { setPedestalInversion } from "./pedestalInversion";
import { setTrackedPedestalInvertedActive } from "../../../features/corruption/effects/activeItemTracker";

/**
 * Morphs a Zazzinator item into an inverted collectible using the RemovedInvertedItemTracker. If no
 * match can be found, it will be morphed into a random inverted item.
 */
export function setZazzinatorToRemovedItem(
  zazzinatorItem: EntityPickupCollectible,
): void {
  const zazzCollectibleType = zazzinatorItem.SubType;
  if (!isZazzinatorAny(zazzCollectibleType)) {
    return;
  }

  /** Search through removed items in reverse. */
  const removedItems = _getRemovedInvertedItems();

  for (let i = removedItems.length - 1; i >= 0; i--) {
    const removedItem = removedItems[i];
    if (removedItem === undefined) {
      continue;
    }

    const { dummyItem, referenceCollectible, InvertedActiveActionSet } =
      removedItem;
    if (dummyItem !== zazzCollectibleType) {
      continue;
    }

    // We found a match.
    setCollectibleSubType(zazzinatorItem, referenceCollectible);
    // Don't update as we will do that later.
    setPedestalInversion(true, zazzinatorItem);
    // Update the pedestal's active tracker if it is an active item.
    if (InvertedActiveActionSet !== undefined) {
      setTrackedPedestalInvertedActive(zazzinatorItem, InvertedActiveActionSet);
    }
    // Set the pedestal.charge if we know the charge of the non-Inverted active item.
    const charge = InvertedActiveActionSet?.getFlipCharge();
    if (charge !== undefined) {
      zazzinatorItem.Charge = charge;
    }

    removedItems.splice(i, 1);
    fprint(
      `Zazzinator item ${zazzCollectibleType} morphed into ${getCollectibleName(
        referenceCollectible,
      )}`,
    );
    return;
  }

  // We did not find a match.
  fprint(
    `Zazzinator item ${zazzCollectibleType} morphed into a random item due to not finding a match`,
  );
  setPedestalInversion(false, zazzinatorItem);
  setCollectibleSubType(zazzinatorItem, CollectibleType.SAD_ONION);
}
