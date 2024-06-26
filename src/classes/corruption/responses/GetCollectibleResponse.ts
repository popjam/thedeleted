import { CollectibleType } from "isaac-typescript-definitions";
import { getCollectibleName } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import {
  collectibleAttributeToText,
  getCollectibleSeverity,
  getRandomAssortmentOfCollectibles,
  getRandomCollectibleType,
} from "../../../helper/collectibleHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { CollectibleAttribute } from "../../../interfaces/general/CollectibleAttribute";
import { Response } from "./Response";
import { getCollectibleNameWithEIDSetting } from "../../../helper/compatibility/EID/EIDHelper";
import { QUALITY_2_ITEM_SEVERITY } from "../../../constants/severityConstants";

/** Defaults to The Poop if no activeItem is set. */
const EMPTY_COLLECTIBLE_TEXT = "a random collectible";
const EMPTY_COLLECTIBLE_TEXT_PLURAL = "random collectibles";
const FIRST_TIME_PICKING_UP = true;
const VERB = "get";
const VERB_PARTICIPLE = "getting";
const DEFAULT_COLLECTIBLE = CollectibleType.POOP;
const DEFAULT_SEVERITY = QUALITY_2_ITEM_SEVERITY;

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

  /**
   * Constructs a new instance of the GetCollectibleResponse class.
   *
   * @param collectible The collectible type or attribute. Leave undefined to get a random
   *                    collectible.
   * @param morality The morality value.
   * @returns The constructed GetCollectibleResponse instance.
   */
  construct(
    collectible?: CollectibleType | CollectibleAttribute,
    morality?: Morality,
  ): this {
    if (morality !== undefined) {
      this.mo = morality;
    }
    if (collectible !== undefined) {
      this.aT = collectible;
    }
    return this;
  }

  override shuffle(): this {
    return super.shuffle();
  }

  override getSeverity(): number {
    const collectible = this.getCollectible();
    if (typeof collectible === "number") {
      return super.getSeverity(getCollectibleSeverity(collectible));
    }

    return super.getSeverity(DEFAULT_SEVERITY);
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
  calculateCollectible(): CollectibleType {
    const collectible = this.getCollectible();
    if (typeof collectible === "number") {
      return collectible;
    }
    return getRandomCollectibleType(collectible) ?? DEFAULT_COLLECTIBLE;
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
    const isMultiple = this.isMultiple();
    let text = "";

    if (typeof collectible === "object") {
      text += ` ${collectibleAttributeToText(collectible, isMultiple)}`;
    } else if (collectible === undefined) {
      text += isMultiple
        ? EMPTY_COLLECTIBLE_TEXT_PLURAL
        : EMPTY_COLLECTIBLE_TEXT;
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
    const chanceToActivate = this.getChanceToActivateText(participle);

    return `${chanceToActivate} ${verb} ${noun}`;
  }

  /** Array may be empty. */
  override trigger(triggerData?: TriggerData): CollectibleType[] {
    return super.trigger(triggerData) as CollectibleType[];
  }

  fire(triggerData: TriggerData): CollectibleType | undefined {
    const player = triggerData.player ?? Isaac.GetPlayer();

    // Standard firing procedure.
    const collectibleToFire = this.calculateCollectible();

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
