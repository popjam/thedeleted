import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { ActionSet } from "./ActionSet";

export class BasicActionSet extends ActionSet {
  override actionSetType = ActionSetType.BASIC;
}
