import { InvertedItemActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { defaultInvertedItemActionSetBuilder } from "../../helper/builders/genericBuilders";
import { happy99DefaultBuilder } from "../../helper/builders/modes/HAPPY99Builders";
import { iLoveYouDefaultBuilder } from "../../helper/builders/modes/ILOVEYOUBuilders";
import { morrisDefaultBuilder } from "../../helper/builders/modes/MORRISBuilders";
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
    (inputs: ActionSetBuilderInput) =>
      defaultInvertedItemActionSetBuilder(inputs),
  ],
  [
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_HAPPY_DEFAULT,
    (inputs: ActionSetBuilderInput) => happy99DefaultBuilder(inputs),
  ],
  [
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_ILOVEYOU_DEFAULT,
    (inputs: ActionSetBuilderInput) => iLoveYouDefaultBuilder(inputs),
  ],
  [
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_MORRIS_DEFAULT,
    (inputs: ActionSetBuilderInput) => morrisDefaultBuilder(inputs),
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
