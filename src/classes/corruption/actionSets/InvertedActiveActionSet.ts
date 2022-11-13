import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { InvertedItemActionSet } from "./InvertedItemActionSet";

const DEFAULT_NAME = "Corrupted Active Item";

/** ActionSet class. */
export class InvertedActiveActionSet extends InvertedItemActionSet {
  override actionSetType: ActionSetType = ActionSetType.INVERTED_ACTIVE_ITEM;
  charges = 4;

  override getName(): string {
    return this.n ?? DEFAULT_NAME;
  }
}
