import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibleName, setCollectibleSubType } from "isaacscript-common";
import { _getRemovedInvertedItems } from "../../../features/corruption/inventory/removedInvertedItems";
import { isZazzinatorAny } from "../../../sets/zazzSets";
import { fprint } from "../../printHelper";
import { setPedestalInversion } from "../inversion/pedestalInversion";
import { setTrackedPedestalInvertedActive } from "../../../features/corruption/effects/activeItemTracker";

/**
 * Morphs a Zazzinator pedestal into an inverted collectible using the RemovedInvertedItemTracker.
 * If no match can be found, it will be morphed into a random inverted item.
 *
 * @param zazzinatorItem The Zazzinator item that has spawned on the ground.
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
  fprint(
    `removedItems: Searching through ${removedItems.length} removed items to replace Zazzinator item ${zazzCollectibleType}..`,
  );

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
    fprint(
      `removedItems: Found a match for Zazzinator item ${zazzCollectibleType}! dummyItem: ${dummyItem}, referenceCollectible: ${referenceCollectible}, InvertedActiveActionSet: ${InvertedActiveActionSet}`,
    );
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
      fprint(`removedItems: Setting pedestal charge to ${charge}`);
      zazzinatorItem.Charge = charge;
    }

    removedItems.splice(i, 1);
    fprint(
      `removedItems: Zazzinator item ${zazzCollectibleType} morphed into ${getCollectibleName(
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
