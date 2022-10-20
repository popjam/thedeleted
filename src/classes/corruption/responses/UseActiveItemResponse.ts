import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { getCollectibleName } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { numberToWords } from "../../../helper/numbers/numberToWords";
import { rangeToString } from "../../../types/general/Range";
import { Response } from "./Response";

/** Defaults to The Poop if no activeItem is set. */
const DEFAULT_ACTIVE_ITEM = CollectibleType.POOP;
const VERB = "use";

/** Response which uses Active items. */
export class UseActiveItemResponse extends Response {
  override responseType: ResponseType = ResponseType.USE_ACTIVE_ITEM;
  activeItem: CollectibleType = DEFAULT_ACTIVE_ITEM;

  /** Alternative constructor so SaveData works with class. */
  construct(morality: Morality, activeItem: CollectibleType): this {
    this.morality = morality;
    this.activeItem = activeItem;
    return this;
  }

  getActiveItem(): CollectibleType {
    return this.activeItem;
  }

  setActiveItem(activeItem: CollectibleType): this {
    this.activeItem = activeItem;
    return this;
  }

  override getAmountOfActivationsText(): string {
    const amount = this.getAmountOfActivations();
    if (typeof amount === "number") {
      if (amount === 1) {
        return "";
      }
      return `${numberToWords(amount)} times`;
    }
    return `${rangeToString(amount)} times`;
  }

  override getText(): string {
    const text = `${VERB} ${getCollectibleName(
      this.activeItem,
    )} ${this.getAmountOfActivationsText()}`;
    return text;
  }

  fire(player: EntityPlayer): void {
    player.UseActiveItem(this.activeItem, UseFlag.NO_ANIMATION);
  }
}
