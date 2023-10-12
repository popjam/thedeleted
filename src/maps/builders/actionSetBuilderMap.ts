import { InvertedItemActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { defaultInvertedItemActionSetBuilder } from "../../helper/builders/genericBuilders";
import { happy99DefaultBuilder } from "../../helper/builders/modes/HAPPY99Builders";
import { hicurdismosDefaultBuilder } from "../../helper/builders/modes/HICURDISMOSBuilders";
import { iLoveYouDefaultBuilder } from "../../helper/builders/modes/ILOVEYOUBuilders";
import { morrisDefaultBuilder } from "../../helper/builders/modes/MORRISBuilders";
import { mydoomDefaultBuilder } from "../../helper/builders/modes/MYDOOMBuilders";
import { revetonDefaultBuilder } from "../../helper/builders/modes/REVETONBuilders";
import type { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import type {
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
  [
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_HICURDISMOS_DEFAULT,
    (inputs: ActionSetBuilderInput) => hicurdismosDefaultBuilder(inputs),
  ],
  [
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_MYDOOM_DEFAULT,
    (inputs: ActionSetBuilderInput) => mydoomDefaultBuilder(inputs),
  ],
  [
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_REVETON_DEFAULT,
    (inputs: ActionSetBuilderInput) => revetonDefaultBuilder(inputs),
  ],
]);

/** Returns the ActionSetBuilder correlated to the ActionSetBuilderReference. */
export function getInvertedItemActionSetBuilderFromReference(
  reference: InvertedItemActionSetBuilderReference,
): InvertedItemActionSetBuilder {
  const builder = INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE_MAP.get(reference);
  if (builder === undefined) {
    error("actionSetBuilderReferenceMap: Builder not found!");
  } else {
    return builder as InvertedItemActionSetBuilder;
  }
}
