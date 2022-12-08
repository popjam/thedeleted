import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { InvertedItemActionSet } from "../../classes/corruption/actionSets/InvertedItemActionSet";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/InvertedPassiveActionSet";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { happy99DefaultBuilder } from "../../helper/builders/modes/HAPPY99Builders";
import { getRandomCollectibleType } from "../../helper/collectibleHelper";
import {
  Builder,
  InvertedItemActionSetBuilder,
} from "../../types/general/Builder";

const INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE_MAP: ReadonlyMap<
  InvertedItemActionSetBuilderReference,
  Builder<InvertedItemActionSet>
> = new Map([
  [
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_DEFAULT,
    () =>
      new InvertedPassiveActionSet().addEffects(
        new UseActiveItemResponse().construct(
          getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
            CollectibleType.POOP,
        ),
      ),
  ],
  [
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_HAPPY99_DEFAULT,
    () => happy99DefaultBuilder(),
  ],
]);

/** Returns the ActionSetBuilder correlated to the ActionSetBuilderReference. */
export function getInvertedItemActionSetBuilderFromReference(
  reference: InvertedItemActionSetBuilderReference,
): InvertedItemActionSetBuilder {
  const builder = INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE_MAP.get(reference);
  if (builder === undefined) {
    throw new Error("actionSetBuilderReferenceMap: Builder not found!");
  } else {
    return builder as InvertedItemActionSetBuilder;
  }
}
