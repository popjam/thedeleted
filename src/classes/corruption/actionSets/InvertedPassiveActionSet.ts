import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { InvertedItemActionSet } from "./InvertedItemActionSet";

const DEFAULT_NAME = "Corrupted Passive Item";

/** ActionSet class. */
export class InvertedPassiveActionSet extends InvertedItemActionSet {
  override actionSetType: ActionSetType = ActionSetType.INVERTED_PASSIVE_ITEM;

  override getName(): string {
    return this.n ?? DEFAULT_NAME;
  }
}
