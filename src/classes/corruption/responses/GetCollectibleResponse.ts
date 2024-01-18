import type { CollectibleType } from "isaac-typescript-definitions";
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
import { getCollectibleNameWithEIDSetting } from "../../../helper/compatibility/EID/EIDHelper";
import { fprint } from "../../../helper/printHelper";
import { addTheS } from "../../../helper/stringHelper";

/** Defaults to The Poop if no activeItem is set. */
const EMPTY_COLLECTIBLE_TEXT = "nothing";
const FIRST_TIME_PICKING_UP = true;
const VERB = "get";
const VERB_PARTICIPLE = "getting";

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
  override getInvolvedCollectibles(): readonly CollectibleType[] {
    const collectible = this.getCollectible();
    if (collectible === undefined) {
      return [];
    }
    if (typeof collectible === "object") {
      return getRandomAssortmentOfCollectibles([1, 3], collectible);
    }
    return [collectible];
  }

  /**
   * Calculates the collectible to get upon triggering the Response. If the collectible is a
   * CollectibleAttribute, a random collectible from the group is returned.
   *
   * If a collectible can not be found, returns undefined (which will mean this Response will not
   * fire properly).
   */
  calculateCollectible(): CollectibleType | undefined {
    const collectible = this.getCollectible();
    if (typeof collectible === "object") {
      return getRandomCollectibleType(collectible);
    }
    return collectible;
  }

  /**
   * The collectible to get. Can be a specific item or randomly from a group of items (defined by
   * CollectibleAttribute).
   */
  getCollectible(): CollectibleType | CollectibleAttribute | undefined {
    return this.aT;
  }

  /**
   * The collectible to get. Can be a specific item or randomly from a group of items (defined by
   * CollectibleAttribute).
   */
  setCollectible(collectible: CollectibleType | CollectibleAttribute): this {
    this.aT = collectible;
    return this;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
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

  getCollectibleText(eid: boolean): string {
    const collectible = this.getCollectible();
    if (typeof collectible === "object") {
      return collectibleAttributeToText(collectible);
    }
    if (collectible === undefined) {
      return EMPTY_COLLECTIBLE_TEXT;
    }
    return eid
      ? getCollectibleNameWithEIDSetting(collectible)
      : getCollectibleName(collectible);
  }

  /**
   * Get noun text with amount of activations.
   *
   * @example "brimstone"
   * @example "3 brimstone's"
   */
  override getNoun(eid: boolean): string {
    const collectible = this.getCollectible();
    const amountOfActivationsText = this.getAmountOfActivationsText();
    const isMultiple = this.isMultiple();
    let text = amountOfActivationsText;

    if (typeof collectible === "object") {
      text += ` ${collectibleAttributeToText(collectible, isMultiple)}`;
    } else if (collectible === undefined) {
      text += ` ${addTheS(EMPTY_COLLECTIBLE_TEXT, isMultiple)}`;
    } else {
      text += ` ${getCollectibleNameWithEIDSetting(
        collectible,
        isMultiple,
        eid,
      )}`;
    }

    return text;
  }

  override getText(eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun(eid);

    return `${verb} ${noun}`;
  }

  /** Array may be empty. */
  override trigger(triggerData?: TriggerData): CollectibleType[] {
    return super.trigger(triggerData) as CollectibleType[];
  }

  fire(triggerData: TriggerData): CollectibleType | undefined {
    const player = triggerData.player ?? Isaac.GetPlayer();

    // Standard firing procedure.
    const collectibleToFire = this.calculateCollectible();
    if (collectibleToFire === undefined) {
      fprint(
        "Failed to get a collectible to fire for the GetCollectibleResponse.",
      );
      return undefined;
    }

    player.AddCollectible(collectibleToFire, undefined, FIRST_TIME_PICKING_UP);
    return collectibleToFire;
  }
}

/** Type guard to check if a Response is a GetCollectibleResponse. */
export function isGetCollectibleResponse(
  response: Response,
): response is GetCollectibleResponse {
  return response.responseType === ResponseType.GET_COLLECTIBLE;
}
