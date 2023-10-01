import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibleName, setCollectibleSubType } from "isaacscript-common";
import { _getRemovedInvertedItems } from "../../../features/corruption/inventory/removedInvertedItems";
import { isZazzinatorAny } from "../../../sets/zazzSets";
import { fprint } from "../../printHelper";
import { setPedestalInversion } from "./pedestalInversion";

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

    const { playerIndex, dummyItem, referenceCollectible } = removedItem;
    if (dummyItem !== zazzCollectibleType) {
      continue;
    }

    // We found a match.
    setCollectibleSubType(zazzinatorItem, referenceCollectible);
    // Don't update as we will do that later.
    setPedestalInversion(true, zazzinatorItem);
    removedItems.splice(i, 1);
    fprint(`Found a match for: ${zazzCollectibleType}
      With reference: ${referenceCollectible} and name ${getCollectibleName(
        referenceCollectible,
      )}
      Setting pedestal inversion to true.`);
    return;
  }

  // We did not find a match.
  fprint(
    ` ERROR: Could not find a match for Zazzinator item ${zazzCollectibleType}!
    Setting pedestal inversion to false and morphing into Sad Onion.
    O------O END setZazzinatorToRemovedItem O------O

    `,
  );
  setPedestalInversion(false, zazzinatorItem);
  setCollectibleSubType(zazzinatorItem, CollectibleType.SAD_ONION);
}
