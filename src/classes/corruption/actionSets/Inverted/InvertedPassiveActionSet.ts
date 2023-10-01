import type { CollectibleType } from "isaac-typescript-definitions";
import { deepCopy } from "isaacscript-common";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { ActionOrigin } from "../../../../enums/corruption/actions/ActionOrigin";
import type { ActionType } from "../../../../enums/corruption/actions/ActionType";
import { CollectibleTypeCustom } from "../../../../enums/general/CollectibleTypeCustom";
import {
  addActionsToPlayer,
  removeActionWithPredicate,
} from "../../../../features/corruption/effects/playerEffects";
import {
  _addInvertedItemToCorruptInventory,
  _removeInvertedItemFromCorruptInventory,
} from "../../../../features/corruption/inventory/itemInventory";
import {
  PickupStage,
  setLastPickedUpCollectible,
} from "../../../../features/corruption/inversion/lastPickedUpInverted";
import { fprint } from "../../../../helper/printHelper";
import { mod } from "../../../../mod";
import type { Action } from "../../actions/Action";
import { isAction } from "../../actions/Action";
import type { Response } from "../../responses/Response";
import { InvertedItemActionSet } from "./InvertedItemActionSet";

const DEFAULT_NAME = "Corrupted Passive Item";

/** ActionSet class. */
export class InvertedPassiveActionSet extends InvertedItemActionSet {
  override actionSetType: ActionSetType = ActionSetType.INVERTED_PASSIVE_ITEM;

  /**
   * For passive ActionSets, Actions will be added to the player, and Responses will be triggered
   * immediately.
   */
  addToPlayer(
    player: EntityPlayer,
    collectible: CollectibleType,
    addLogo: boolean,
    addToInventory: boolean,
  ): void {
    const actionsAndResponses = deepCopy<Array<Action | Response>>(
      this.getEffects(),
    );
    for (const actionOrResponse of actionsAndResponses) {
      if (isAction(actionOrResponse)) {
        actionOrResponse.o = [ActionOrigin.INVERTED_COLLECTIBLE, collectible];
        addActionsToPlayer(player, actionOrResponse);
      } else {
        actionOrResponse.trigger({ player });
      }
    }

    if (addLogo) {
      player.AddCollectible(CollectibleTypeCustom.ZAZZ);
    }
    if (addToInventory) {
      _addInvertedItemToCorruptInventory(player, collectible);
    }
  }

  /** Remove a passive collectible from the player. */
  removeFromPlayer(
    player: EntityPlayer,
    collectible: CollectibleType,
    removeLogo: boolean,
    removeFromInventory: boolean,
  ): void {
    // Remove the Actions using advanced GPT-5 AI technology.
    const actionTypes = this.getActions().map((action) => action.actionType);
    actionTypes.forEach((actionType: ActionType) => {
      removeActionWithPredicate(
        (action) =>
          action.o?.[0] === ActionOrigin.INVERTED_COLLECTIBLE &&
          action.o[1] === (collectible as number),
        player,
        actionType,
      );
    });

    // Remove the logo from player item tracker.
    if (removeLogo) {
      player.RemoveCollectible(CollectibleTypeCustom.ZAZZ);
    }

    // Remove most recent from inventory.
    if (removeFromInventory) {
      _removeInvertedItemFromCorruptInventory(player, collectible);
    }
  }

  preGetPedestal(
    player: EntityPlayer,
    pedestal: EntityPickupCollectible,
  ): boolean | undefined {
    setLastPickedUpCollectible(player, {
      collectibleType: pedestal.SubType,
      pickupStage: PickupStage.PRE_GET_PEDESTAL,
      pickupIndex: mod.getPickupIndex(pedestal),
      inverted: true,
    });
    pedestal.SubType = CollectibleTypeCustom.ZAZZ;
    fprint(`    SubType changed to ${pedestal.SubType}.
    X-------X END OF PRE GET PEDESTAL X-------X

    `);
    return false;
  }

  override getName(): string {
    return this.n ?? DEFAULT_NAME;
  }
}
