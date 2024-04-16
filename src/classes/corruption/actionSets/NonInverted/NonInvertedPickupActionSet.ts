import { ColorDefault, deepCopy } from "isaacscript-common";
import { MOD_NAME } from "../../../../constants/mod/modConstants";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { _addActionsToTracker } from "../../../../features/corruption/effects/playerEffects";
import {
  getGenericEntityEIDDescriptionObject,
  setSpecificEntityEIDDescriptionObject,
} from "../../../../helper/compatibility/EID/EIDHelper";
import { legibleString } from "../../../../helper/stringHelper";
import type { Action } from "../../actions/Action";
import { isAction } from "../../actions/Action";
import type { Response } from "../../responses/Response";
import { ActionSet } from "../ActionSet";

/**
 * ActionSet class for Non-Inverted Pickups. Pickups by default do not have ActionSets, and adding
 * one will make them have an effect when picked up or used, depending on the pickup.
 */
export class NonInvertedPickupActionSet extends ActionSet {
  override actionSetType: ActionSetType = ActionSetType.NON_INVERTED_PICKUP;

  /** This color will be reflected in the entity which the ActionSet belongs to. */
  color?: Color;
  n?: string;

  /** Amount extracted by the 'Extract' item. */
  ext?: number;

  /** If negatives have carried over. */
  ngo?: true;

  getColor(): Color | undefined {
    return this.color;
  }

  setColor(color: Color): this {
    this.color = color;
    return this;
  }

  /** Get the name of the corrupted item. */
  getName(): string | undefined {
    return this.n;
  }

  /** Set the name of the corrupted item. */
  setName(name: string): this {
    this.n = name;
    return this;
  }

  /** Updates the EID Description and appearance of the collectible. */
  updateAppearance(pickup: EntityPickup): void {
    // Set colour.
    const color = this.getColor();
    pickup.SetColor(color ?? ColorDefault, 0, 1);

    // Update the Description and Name.
    const genericDesc =
      getGenericEntityEIDDescriptionObject(pickup)?.Description ?? "";
    const desc = legibleString(this.getText());
    const newDesc = `${genericDesc} ${desc}`;
    const genericName = getGenericEntityEIDDescriptionObject(pickup)?.Name;

    // Set the EID Desc Object.
    setSpecificEntityEIDDescriptionObject(pickup, {
      Description: newDesc,
      ModName: MOD_NAME,
      Name: this.getName() ?? genericName,
    });
  }

  /**
   * Adding a non-Inverted Pickup ActionSet to the player will immediately trigger its Responses,
   * and add its Actions
   */
  addToPlayer(player: EntityPlayer): void {
    const actionsAndResponses = deepCopy<Array<Action | Response>>(
      this.getEffects(),
    );
    for (const actionOrResponse of actionsAndResponses) {
      if (isAction(actionOrResponse)) {
        _addActionsToTracker(player, actionOrResponse);
      } else {
        actionOrResponse.trigger({ player });
      }
    }
  }

  /**
   * Occurs when the player has 'interacted' with the ActionSet, such as picking up a corrupted item
   * or using a corrupted consumable.
   */
  // abstract trigger(player: EntityPlayer): void;
}
