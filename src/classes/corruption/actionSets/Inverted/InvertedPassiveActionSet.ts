import { ActionSetType } from "../../../../enums/corruption/actionSets/ActionSetType";
import { CollectibleTypeCustom } from "../../../../enums/general/CollectibleTypeCustom";
import { setTrackedPedestalCharge } from "../../../../features/corruption/effects/activeItemTracker";
import { InvertedItemActionSet } from "./InvertedItemActionSet";

const DEFAULT_NAME = "Corrupted Passive Item";

/** ActionSet class. */
export class InvertedPassiveActionSet extends InvertedItemActionSet {
  override actionSetType: ActionSetType = ActionSetType.INVERTED_PASSIVE_ITEM;

  preGetPedestal(
    _player: EntityPlayer,
    pedestal: EntityPickupCollectible,
  ): boolean | undefined {
    // Save the original charge of the item on the pedestal. This should always be the charge of the
    // non-Inverted active (if the non-Inverted item is a passive, we can ignore this). Even though
    // this is a passive inverted item, the non-inverted item may be an active item.
    setTrackedPedestalCharge(pedestal, pedestal.Charge);

    pedestal.SubType = CollectibleTypeCustom.ZAZZ;

    return false;
  }

  override getName(): string {
    return this.n ?? DEFAULT_NAME;
  }
}
