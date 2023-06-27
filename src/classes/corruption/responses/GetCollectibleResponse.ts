import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibleName } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import {
  getRandomAssortmentOfCollectibles,
  getRandomCollectibleType,
} from "../../../helper/collectibleHelper";
import { numberToWords } from "../../../helper/numbers/numberToWords";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { CollectibleAttribute } from "../../../interfaces/general/CollectibleAttribute";
import { rangeToString } from "../../../types/general/Range";
import { Response } from "./Response";

/** Defaults to The Poop if no activeItem is set. */
const DEFAULT_COLLECTIBLE = CollectibleType.POOP;
const FIRST_TIME_PICKING_UP = true;
const VERB = "get";

/**
 * Response which uses Active items. The 'activeItem' field can either be a CollectibleType of the
 * active item, or a 'ActiveCollectibleAttribute' object. Every time the Response triggers, if using
 * the object, a random active item following the properties described in the
 * 'ActiveCollectibleAttribute' object will be used.
 *
 * @example Use The Poop.
 * @example Use a quality 4 active item.
 */
export class GetCollectibleResponse extends Response {
  override responseType: ResponseType = ResponseType.GET_COLLECTIBLE;
  private aT?: CollectibleType | CollectibleAttribute;

  /** Alternative constructor so SaveData works with class. */
  construct(
    collectible: CollectibleType | CollectibleAttribute,
    morality?: Morality,
  ): this {
    if (morality !== undefined) {
      this.mo = morality;
    }
    this.aT = collectible;
    return this;
  }

  /** Get collectibles mentioned. */
  override getInvolvedCollectibles(): CollectibleType[] {
    const active = this.getCollectible();
    if (typeof active === "object") {
      return getRandomAssortmentOfCollectibles([1, 3], active);
    }
    return [active];
  }

  /**
   * Calculates the collectible to get upon triggering the Response, taking into account the
   * different types of 'collectibles'.
   */
  calculateCollectible(): CollectibleType {
    const collectible = this.getCollectible();
    if (typeof collectible === "object") {
      return getRandomCollectibleType(collectible) ?? DEFAULT_COLLECTIBLE;
    }
    return collectible;
  }

  /**
   * The collectible to get. Can be a specific item or randomly from a group of items (defined by
   * CollectibleAttribute).
   */
  getCollectible(): CollectibleType | CollectibleAttribute {
    return this.aT ?? DEFAULT_COLLECTIBLE;
  }

  /**
   * The collectible to get. Can be a specific item or randomly from a group of items (defined by
   * CollectibleAttribute).
   */
  setCollectible(collectible: CollectibleType): this {
    this.aT = collectible;
    return this;
  }

  // TODO: Map ActiveItems to Morality and return that if undefined.
  override getMorality(): Morality {
    return this.mo ?? Morality.NEUTRAL;
  }

  override getAmountOfActivationsText(): string {
    const amountOfActivations = this.getAmountOfActivations();
    if (typeof amountOfActivations === "number") {
      if (amountOfActivations === 1) {
        return "";
      }
      return `${numberToWords(amountOfActivations)}x`;
    }
    return `${rangeToString(amountOfActivations)}x`;
  }

  // TODO: Finish.
  getCollectibleText(): string {
    const collectible = this.getCollectible();
    if (typeof collectible === "object") {
      return " a random collectible ";
    }
    return getCollectibleName(collectible);
  }

  override getText(): string {
    const text = `${VERB} ${this.getAmountOfActivationsText()} ${this.getCollectibleText()}`;
    return text;
  }

  fire(triggerData: TriggerData): void {
    const player = triggerData.player ?? Isaac.GetPlayer();

    // Standard firing procedure.
    player.AddCollectible(
      this.calculateCollectible(),
      undefined,
      FIRST_TIME_PICKING_UP,
    );
  }
}

/** Type guard to check if a Response is a GetCollectibleResponse. */
export function isGetCollectibleResponse(
  response: Response,
): response is GetCollectibleResponse {
  return response.responseType === ResponseType.GET_COLLECTIBLE;
}
