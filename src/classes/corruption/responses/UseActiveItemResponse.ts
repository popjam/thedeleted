import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { getCollectibleName } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { numberToWords } from "../../../helper/numbers/numberToWords";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Range, rangeToString } from "../../../types/general/Range";
import { Response } from "./Response";

/** Defaults to The Poop if no activeItem is set. */
const DEFAULT_ACTIVE_ITEM = CollectibleType.POOP;
const VERB = "use";

/** Response which uses Active items. */
export class UseActiveItemResponse extends Response {
  override responseType: ResponseType = ResponseType.USE_ACTIVE_ITEM;
  activeItem: CollectibleType = DEFAULT_ACTIVE_ITEM;

  /** Alternative constructor so SaveData works with class. */
  construct(activeItem: CollectibleType, morality?: Morality): this {
    if (morality !== undefined) {
      this.morality = morality;
    }
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

  // TODO: Map ActiveItems to Morality and return that if undefined.
  override getMorality(): Morality {
    return this.morality ?? Morality.NEUTRAL;
  }

  override getAmountOfActivationsText(
    overrideAmountOfActivations?: number | Range,
  ): string {
    const amountOfActivations =
      overrideAmountOfActivations ?? this.getAmountOfActivations();
    if (typeof amountOfActivations === "number") {
      if (amountOfActivations === 1) {
        return "";
      }
      return `${numberToWords(amountOfActivations)} times`;
    }
    return `${rangeToString(amountOfActivations)} times`;
  }

  override getText(overrideAmountOfActivations?: number | Range): string {
    const text = `${VERB} ${getCollectibleName(
      this.activeItem,
    )} ${this.getAmountOfActivationsText(overrideAmountOfActivations)}`;
    return text;
  }

  fire(triggerData: TriggerData): void {
    const { player } = triggerData;
    player?.UseActiveItem(this.activeItem, UseFlag.NO_ANIMATION);
  }
}
