import { deepCopy } from "isaacscript-common";
import { EID_ENTITY_DATA_KEY } from "../../../constants/eidConstants";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { addActionOrResponseToPlayer } from "../../../features/corruption/effects/playerEffects";
import { ActionSet } from "./ActionSet";

/** ActionSet class. */
export class NonInvertedPickupActionSet extends ActionSet {
  override actionSetType: ActionSetType = ActionSetType.NON_INVERTED_PICKUP;
  /** This color will be reflected in the entity which the ActionSet belongs to. */
  color?: Color;
  quality = 0;

  getColor(): Color | undefined {
    return this.color;
  }

  setColor(color: Color): this {
    this.color = color;
    return this;
  }

  /** Updates the EID Description and appearance of the collectible. */
  updateAppearance(pickup: EntityPickup): void {
    if (this.color !== undefined) {
      pickup.SetColor(this.color, 0, 1);
    }
    pickup.GetData()[EID_ENTITY_DATA_KEY] = this.getText();
  }

  /**
   * Occurs when the player has 'interacted' with the ActionSet, such as picking up a corrupted item
   * or using a corrupted consumable.
   */
  trigger(player: EntityPlayer): void {
    addActionOrResponseToPlayer(player, ...deepCopy(this.effects));
  }
}
