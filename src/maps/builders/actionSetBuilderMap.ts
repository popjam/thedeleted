import { ActionSet } from "../../classes/corruption/actionSets/ActionSet";
import { BasicActionSet } from "../../classes/corruption/actionSets/BasicActionSet";
import { ActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { happy99DefaultBuilder } from "../../helper/builders/modes/HAPPY99Builders";
import { ActionSetBuilder, Builder } from "../../types/general/Builder";

const ACTION_SET_BUILDER_REFERENCE_MAP: ReadonlyMap<
  ActionSetBuilderReference,
  Builder<ActionSet>
> = new Map([
  [ActionSetBuilderReference.ACTION_SET_DEFAULT, () => new BasicActionSet()],
  [
    ActionSetBuilderReference.ACTION_SET_HAPPY99_DEFAULT,
    () => happy99DefaultBuilder(),
  ],
]);

/** Returns the ActionSetBuilder correlated to the ActionSetBuilderReference. */
export function getActionSetBuilderFromReference(
  reference: ActionSetBuilderReference,
): ActionSetBuilder {
  const builder = ACTION_SET_BUILDER_REFERENCE_MAP.get(reference);
  if (builder === undefined) {
    throw new Error("actionSetBuilderReferenceMap: Builder not found!");
  } else {
    return builder;
  }
}
