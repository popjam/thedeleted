import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { InvertedItemActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { happy99DefaultBuilder } from "../../helper/builders/modes/HAPPY99Builders";
import { getRandomCollectibleType } from "../../helper/collectibleHelper";
import { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";
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
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_HAPPY_DEFAULT,
    (inputs: ActionSetBuilderInput) => happy99DefaultBuilder(inputs),
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
