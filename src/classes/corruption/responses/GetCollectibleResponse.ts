import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibleName } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import {
  collectibleAttributeToText,
  getRandomAssortmentOfCollectibles,
  getRandomCollectibleType,
} from "../../../helper/collectibleHelper";
import { numberToWords } from "../../../helper/numbers/numberToWords";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { CollectibleAttribute } from "../../../interfaces/general/CollectibleAttribute";
import { rangeToString } from "../../../types/general/Range";
import { Response } from "./Response";
import { getCollectibleNameWithEIDSetting } from "../../../helper/compatibility/EIDHelper";

/** Defaults to The Poop if no activeItem is set. */
const DEFAULT_COLLECTIBLE = CollectibleType.POOP;
const FIRST_TIME_PICKING_UP = true;
const VERB = "get";

/**
 * This Response gives the player collectibles. The collectible can be a specific item, or a random
 * item from a group of items.
 *
 * @field aT The collectible to get. Can be a specific item or randomly from a group of items
 *        (defined by CollectibleAttribute).
 *
 * @example Get The Poop.
 * @example Get a quality 4 active item.
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
    const collectible = this.getCollectible();
    if (typeof collectible === "object") {
      return getRandomAssortmentOfCollectibles([1, 3], collectible);
    }
    return [collectible];
  }

  /**
   * Calculates the collectible to get upon triggering the Response. If the collectible is a
   * CollectibleAttribute, a random collectible from the group is returned.
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
  setCollectible(collectible: CollectibleType | CollectibleAttribute): this {
    this.aT = collectible;
    return this;
  }

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
  getCollectibleText(eid = true): string {
    const collectible = this.getCollectible();
    if (typeof collectible === "object") {
      return collectibleAttributeToText(collectible);
    }
    return eid
      ? getCollectibleNameWithEIDSetting(collectible)
      : getCollectibleName(collectible);
  }

  override getText(eid = true): string {
    const text = `${VERB} ${this.getAmountOfActivationsText()} ${this.getCollectibleText(
      eid,
    )}`;
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
