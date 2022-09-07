import { CollectibleType } from "isaac-typescript-definitions";
import {
  getCollectibleArray,
  getCollectibleItemType,
  getRandomArrayElement,
} from "isaacscript-common";
import {
  CollectibleAttribute,
  CollectibleAttributeExtra,
} from "../interfaces/CollectibleAttribute";

/** TODO: Update to change depending on MCM Include Modded Items setting. */
/** Gets a random CollectibleType depending on the CollectibleAttributes you have provided. */
export function getRandomCollectibleType(
  attributes: CollectibleAttribute | CollectibleAttributeExtra,
): CollectibleType | undefined {
  const filteredCollectibleTypes = getCollectibleArray().filter((itemType) => {
    let matches = true;
    if (attributes.itemType !== undefined) {
      matches = attributes.itemType === getCollectibleItemType(itemType);
    }
    if (attributes.poolType !== undefined) {
    }
    return matches;
  });
  return filteredCollectibleTypes.length > 0
    ? getRandomArrayElement(filteredCollectibleTypes)
    : undefined;
}
