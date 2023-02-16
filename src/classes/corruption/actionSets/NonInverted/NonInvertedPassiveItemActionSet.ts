import { deepCopy } from "isaacscript-common";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { addActionOrResponseToPlayer } from "../../../../features/corruption/effects/playerEffects";
import { NonInvertedPickupActionSet } from "./NonInvertedPickupActionSet";

/** ActionSet class. */
export class NonInvertedPassiveItemActionSet extends NonInvertedPickupActionSet {
  override actionSetType: ActionSetType = ActionSetType.NON_INVERTED_PICKUP;

  /**
   * Occurs when the player has 'interacted' with the ActionSet, such as picking up a corrupted item
   * or using a corrupted consumable.
   */
  trigger(player: EntityPlayer): void {
    addActionOrResponseToPlayer(player, ...deepCopy(this.effects));
  }
}
