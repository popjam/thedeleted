import type { CollectibleType } from "isaac-typescript-definitions";
import { arrayToBitFlags } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import {
  collectibleAttributeToText,
  getRandomAssortmentOfCollectibles,
  getRandomCollectibleType,
} from "../../../helper/collectibleHelper";
import { useActiveItemAtPosition } from "../../../helper/playerHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { ActiveCollectibleAttribute } from "../../../interfaces/general/CollectibleAttribute";
import { Response } from "./Response";
import { fprint } from "../../../helper/printHelper";
import { USE_ACTIVE_ITEM_RESPONSE_BITFLAG_ARRAY } from "../../../constants/corruptionConstants";
import { getCollectibleNameWithEIDSetting } from "../../../helper/compatibility/EID/EIDHelper";

const EMPTY_COLLECTIBLE_TEXT = "a random active item";
const VERB = "use";
const VERB_PARTICIPLE = "using";

/**
 * Response which uses Active items. The 'activeItem' field can either be a CollectibleType of the
 * active item, a 'ActiveCollectibleAttribute' object, or undefined for any Active. Every time the
 * Response triggers, if using the object, a random active item following the properties described
 * in the 'ActiveCollectibleAttribute' object will be used.
 *
 * @example Use The Poop.
 * @example Use a quality 4 active item.
 * @example Use a random active item.
 */
export class UseActiveItemResponse extends Response {
  override responseType: ResponseType = ResponseType.USE_ACTIVE_ITEM;
  private aT?: CollectibleType | ActiveCollectibleAttribute;
  private pos?: Vector;

  /** Alternative constructor so SaveData works with class. */
  construct(
    activeItem: CollectibleType | ActiveCollectibleAttribute,
    position?: Vector,
    morality?: Morality,
  ): this {
    if (morality !== undefined) {
      this.mo = morality;
    }
    if (position !== undefined) {
      this.setPosition(position);
    }
    this.aT = activeItem;
    return this;
  }

  /** Get collectibles mentioned. */
  override getInvolvedCollectibles(): readonly CollectibleType[] {
    const active = this.getActiveItem();
    if (active === undefined) {
      return [];
    }
    if (typeof active === "object") {
      return getRandomAssortmentOfCollectibles([1, 3], active);
    }
    return [active];
  }

  /**
   * Calculates the ActiveItem to use upon triggering the Response, taking into account the
   * different types of 'activeItem'. Will return undefined if it can not find an Active for the
   * given ActiveCollectibleAttribute.
   */
  calculateActiveItem(): CollectibleType | undefined {
    const activeItem = this.getActiveItem();
    if (typeof activeItem === "object" || activeItem === undefined) {
      return getRandomCollectibleType(activeItem);
    }
    return activeItem;
  }

  /**
   * The active item to use. Can be a specific active item or randomly from a group of active items
   * (defined by ActiveCollectibleAttribute), or undefined (a random active).
   */
  getActiveItem(): CollectibleType | ActiveCollectibleAttribute | undefined {
    return this.aT;
  }

  /**
   * The active item to use. Can be a specific active item or randomly from a group of active items
   * (defined by ActiveCollectibleAttribute).
   */
  setActiveItem(
    activeItem: CollectibleType | ActiveCollectibleAttribute | undefined,
  ): this {
    this.aT = activeItem;
    return this;
  }

  /** Get the overridden position to use the active item at. */
  getPosition(): Vector | undefined {
    return this.pos;
  }

  /** Set the overridden position to use the active item at. */
  setPosition(position: Vector): this {
    this.pos = position;
    return this;
  }

  // TODO: Map ActiveItems to Morality and return that if undefined.
  override getMorality(): Morality {
    return this.mo ?? Morality.NEUTRAL;
  }

  override getAmountOfActivationsText(): string {
    const amountText = super.getAmountOfActivationsText();
    if (amountText !== undefined) {
      return `${amountText} times`;
    }

    return "";
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "use fortune cookie"
   * @example "use a random 3 charge active item 4 times"
   */
  override getNoun(eid: boolean): string {
    const plural = this.isMultiple();
    const activeItemText = this.getActiveItemText(eid, plural);
    const amountText = this.getAmountOfActivationsText();

    return `${activeItemText} ${amountText}`;
  }

  /** If undefined, will spawn at player's position. */
  calculatePosition(triggerData: TriggerData): Vector | undefined {
    const position = this.getPosition();
    if (position !== undefined) {
      return position;
    }

    return triggerData.spawnPosition;
  }

  getActiveItemText(eid: boolean, plural: boolean): string {
    const activeItem = this.getActiveItem();
    if (typeof activeItem === "object") {
      return collectibleAttributeToText(activeItem, plural);
    }
    if (activeItem === undefined) {
      return EMPTY_COLLECTIBLE_TEXT;
    }
    return getCollectibleNameWithEIDSetting(activeItem, false, eid);
  }

  override getText(eid: boolean, participle: boolean): string {
    const noun = this.getNoun(eid);
    const verb = this.getVerb(participle);
    const chanceToActivate = this.getChanceToActivateText(participle);

    return `${chanceToActivate} ${verb} ${noun}`;
  }

  /** Array may be empty. */
  override trigger(triggerData?: TriggerData): CollectibleType[] {
    return super.trigger(triggerData) as CollectibleType[];
  }

  fire(triggerData: TriggerData): CollectibleType | undefined {
    const player = triggerData.player ?? Isaac.GetPlayer();
    const activeItem = this.calculateActiveItem();

    if (activeItem === undefined) {
      fprint("Active item is undefined, can't fire UseActiveItemResponse.");
      return undefined;
    }

    const position = this.calculatePosition(triggerData);
    if (position === undefined) {
      player.UseActiveItem(
        activeItem,
        arrayToBitFlags(USE_ACTIVE_ITEM_RESPONSE_BITFLAG_ARRAY),
      );
      return activeItem;
    }

    useActiveItemAtPosition(
      activeItem,
      this.calculatePosition(triggerData) ?? player.Position,
      player,
    );

    return activeItem;
  }
}
