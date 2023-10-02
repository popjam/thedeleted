import type { CollectibleType } from "isaac-typescript-definitions";
import { deepCopy } from "isaacscript-common";
import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { ActionOrigin } from "../../../../enums/corruption/actions/ActionOrigin";
import type { ActionType } from "../../../../enums/corruption/actions/ActionType";
import { CollectibleTypeCustom } from "../../../../enums/general/CollectibleTypeCustom";
import {
  addActionsToTracker,
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
    return false;
  }

  override getName(): string {
    return this.n ?? DEFAULT_NAME;
  }
}
