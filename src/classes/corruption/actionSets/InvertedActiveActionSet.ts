import { ItemConfigChargeType } from "isaac-typescript-definitions";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { InvertedItemActionSet } from "./InvertedItemActionSet";

const DEFAULT_NAME = "Corrupted Active Item";
const DEFAULT_CHARGES = 4;
const DEFAULT_CHARGE_TYPE = ItemConfigChargeType.NORMAL;

/** ActionSet class. */
export class InvertedActiveActionSet extends InvertedItemActionSet {
  override actionSetType: ActionSetType = ActionSetType.INVERTED_ACTIVE_ITEM;
  ch?: number;
  chT?: ItemConfigChargeType;

  override getName(): string {
    return this.n ?? DEFAULT_NAME;
  }

  /**
   * Get number of charges the active item has. This will have different meanings depending on the
   * ChargeType.
   */
  getCharges(): number {
    return this.ch ?? DEFAULT_CHARGES;
  }

  /**
   * Set the amount of charges the item has. This will have different meanings depending on the
   * ChargeType.
   */
  setCharges(charges: number): this {
    this.ch = charges;
    return this;
  }

  /** Get the item's chargeType. */
  getChargeType(): ItemConfigChargeType {
    return this.chT ?? DEFAULT_CHARGE_TYPE;
  }

  /** Set the item's chargeType. */
  setChargeType(chargeType: ItemConfigChargeType): this {
    this.chT = chargeType;
    return this;
  }
}
