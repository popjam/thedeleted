import { ColorDefault, deepCopy } from "isaacscript-common";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { addActionOrResponseToPlayer } from "../../../features/corruption/effects/playerEffects";
import { Action } from "../actions/Action";
import { Response } from "../responses/Response";

/** ActionSet class. */
export abstract class ActionSet {
  readonly actionSetType!: ActionSetType;
  effects: Array<Action | Response> = [];

  /** This color will be reflected in the entity which the ActionSet belongs to. */
  color: Color = ColorDefault;

  /**
   * Adds one or more actions to the ActionSet. Can provide one action, multiple actions or an array
   * of actions.
   */
  addAction(...actions: Action[]): this {
    this.effects = this.effects.concat(actions);
    return this;
  }

  /** Returns deep copy of Actions, not including any responses. */
  getCopyOfEffects(): Array<Action | Response> {
    return deepCopy<Array<Action | Response>>(this.effects);
  }

  getColor(): Color {
    return this.color;
  }

  setColor(color: Color): this {
    this.color = color;
    return this;
  }

  /**
   * Occurs when the player has 'interacted' with the ActionSet, such as picking up a corrupted item
   * or using a corrupted consumable. It usually involves adding the Actions to the player.
   */
  interact(player: EntityPlayer): void {
    addActionOrResponseToPlayer(player, ...this.getCopyOfEffects());
  }
}
