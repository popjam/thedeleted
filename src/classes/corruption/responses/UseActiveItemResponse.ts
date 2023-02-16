import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { getCollectibleName } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import {
  getRandomAssortmentOfCollectibles,
  getRandomCollectibleType,
} from "../../../helper/collectibleHelper";
import { numberToWords } from "../../../helper/numbers/numberToWords";
import { useActiveItemAtPosition } from "../../../helper/playerHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { ActiveCollectibleAttribute } from "../../../interfaces/general/CollectibleAttribute";
import { rangeToString } from "../../../types/general/Range";
import { Response } from "./Response";

/** Defaults to The Poop if no activeItem is set. */
const DEFAULT_ACTIVE_ITEM = CollectibleType.POOP;
const VERB = "use";

/**
 * Response which uses Active items. The 'activeItem' field can either be a CollectibleType of the
 * active item, or a 'ActiveCollectibleAttribute' object. Every time the Response triggers, if using
 * the object, a random active item following the properties described in the
 * 'ActiveCollectibleAttribute' object will be used.
 *
 * @example Use The Poop.
 * @example Use a quality 4 active item.
 */
export class UseActiveItemResponse extends Response {
  override responseType: ResponseType = ResponseType.USE_ACTIVE_ITEM;
  private aT?: CollectibleType | ActiveCollectibleAttribute;

  /** Alternative constructor so SaveData works with class. */
  construct(
    activeItem: CollectibleType | ActiveCollectibleAttribute,
    morality?: Morality,
  ): this {
    if (morality !== undefined) {
      this.mo = morality;
    }
    this.aT = activeItem;
    return this;
  }

  /** Get collectibles mentioned. */
  override getInvolvedCollectibles(): CollectibleType[] {
    const active = this.getActiveItem();
    if (typeof active === "object") {
      return getRandomAssortmentOfCollectibles([1, 3], active);
    }
    return [active];
  }

  /**
   * Calculates the ActiveItem to use upon triggering the Response, taking into account the
   * different types of 'activeItem'.
   */
  calculateActiveItem(): CollectibleType {
    const activeItem = this.getActiveItem();
    if (typeof activeItem === "object") {
      return getRandomCollectibleType(activeItem) ?? DEFAULT_ACTIVE_ITEM;
    }
    return activeItem;
  }

  /**
   * The active item to use. Can be a specific active item or randomly from a group of active items
   * (defined by ActiveCollectibleAttribute).
   */
  getActiveItem(): CollectibleType | ActiveCollectibleAttribute {
    return this.aT ?? DEFAULT_ACTIVE_ITEM;
  }

  /**
   * The active item to use. Can be a specific active item or randomly from a group of active items
   * (defined by ActiveCollectibleAttribute).
   */
  setActiveItem(activeItem: CollectibleType): this {
    this.aT = activeItem;
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
      return `${numberToWords(amountOfActivations)} times`;
    }
    return `${rangeToString(amountOfActivations)} times`;
  }

  getActiveItemText(): string {
    const activeItem = this.getActiveItem();
    if (typeof activeItem === "object") {
      return " a random active item ";
    }
    return getCollectibleName(activeItem);
  }

  override getText(): string {
    const text = `${VERB} ${this.getActiveItemText()} ${this.getAmountOfActivationsText()}`;
    return text;
  }

  fire(triggerData: TriggerData): void {
    const player = triggerData.player ?? Isaac.GetPlayer();

    // If it's called from OnKillAction, use the Active item at the killed NPC location.
    if (triggerData.onKillAction !== undefined) {
      useActiveItemAtPosition(
        this.calculateActiveItem(),
        triggerData.onKillAction.Position,
        player,
      );
    } else if (triggerData.onBombExplodedAction !== undefined) {
      useActiveItemAtPosition(
        this.calculateActiveItem(),
        triggerData.onBombExplodedAction.bomb.Position,
        player,
      );
    } else {
      // Standard firing procedure.
      player.UseActiveItem(this.calculateActiveItem(), UseFlag.NO_ANIMATION);
    }
  }
}
