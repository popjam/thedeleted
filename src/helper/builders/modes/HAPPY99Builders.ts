import { ActionSet } from "../../../classes/corruption/actionSets/ActionSet";
import { BasicActionSet } from "../../../classes/corruption/actionSets/BasicActionSet";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";

export function happy99DefaultBuilder(
  inputs?: ActionSetBuilderInput,
): ActionSet {
  return new BasicActionSet();
}
