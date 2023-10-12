import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { CollectibleTypeCustom } from "../../../../enums/general/CollectibleTypeCustom";
import {
  PickupStage,
  setLastPickedUpCollectible,
} from "../../../../features/corruption/inversion/lastPickedUpInverted";
import { mod } from "../../../../mod";
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
