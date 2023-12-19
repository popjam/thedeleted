import type { CollectibleType } from "isaac-typescript-definitions";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { playerRemovePermanentCollectibleEffect } from "../../../features/general/temporaryItems";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import type { CollectibleAttribute } from "../../../interfaces/general/CollectibleAttribute";
import {
  collectibleAttributeToText,
  getRandomAssortmentOfCollectibles,
  getRandomCollectibleType,
} from "../../../helper/collectibleHelper";
import { fprint } from "../../../helper/printHelper";
import { getCollectibleNameWithEIDSetting } from "../../../helper/compatibility/EID/EIDHelper";
import { getCollectibleName } from "isaacscript-common";
import { numberToWords } from "../../../helper/numbers/numberToWords";
import type { Range } from "../../../types/general/Range";
import { rangeToString } from "../../../types/general/Range";
import { addTheS } from "../../../helper/stringHelper";
import type { Morality } from "../../../enums/corruption/Morality";

const VERB = "lose";
const DEFAULT_CE = false;
const EMPTY_COLLECTIBLE_TEXT = "nothing";

/**
 * Response for removing a collectible from the player. If the player does not have the collectible,
 * nothing happens. The collectible can be in the form of a CollectibleType, a Collectible Effect,
 * or a CollectibleAttribute.
 *
 * @example Remove The Poop.
 * @example Remove the Poop effect.
 */
export class RemoveCollectibleResponse extends Response {
  override responseType: ResponseType = ResponseType.REMOVE_COLLECTIBLE;
  c?: CollectibleType | CollectibleAttribute;
  ce?: boolean;

  /** Alternative constructor so SaveData works with class. */
  construct(
    collectibleToRemove: CollectibleType | CollectibleAttribute,
    amount?: number | Range,
    morality?: Morality,
    isEffect = false,
  ): this {
    if (morality !== undefined) {
      this.mo = morality;
    }
    if (amount !== undefined) {
      this.aoa = amount;
    }
    this.c = collectibleToRemove;
    this.ce = isEffect;
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
   * Whether the Response should remove a physical collectible or a 'permanent' collectible effect.
   * Default is false.
   */
  isCollectibleEffect(): boolean {
    return this.ce ?? DEFAULT_CE;
  }

  /**
   * Whether the Response should remove a physical collectible or a 'permanent' collectible effect.
   * Default is false.
   */
  setCollectibleEffect(isCollectibleEffect: boolean): this {
    this.ce = isCollectibleEffect;
    return this;
  }

  /**
   * Calculates the collectible to remove upon triggering the Response. If the collectible is a
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

  /** Get the collectible to remove. */
  getCollectible(): CollectibleType | CollectibleAttribute | undefined {
    return this.c;
  }

  /** The collectible to remove. */
  setCollectible(collectible: CollectibleType): this {
    this.c = collectible;
    return this;
  }

  getCollectibleText(eid = true): string {
    const collectible = this.getCollectible();
    const amountOfActivations = this.getAmountOfActivations();
    const plural = amountOfActivations !== 1;

    if (typeof collectible === "object") {
      return collectibleAttributeToText(collectible, plural);
    }
    if (collectible === undefined) {
      return addTheS("nothing", plural ? 2 : 1);
    }
    return eid
      ? getCollectibleNameWithEIDSetting(collectible)
      : getCollectibleName(collectible);
  }

  override getAmountOfActivationsText(): string {
    const amountOfActivations = this.getAmountOfActivations();
    if (typeof amountOfActivations === "number") {
      if (amountOfActivations === 1) {
        return "";
      }
      return `${numberToWords(amountOfActivations)}`;
    }
    return `${rangeToString(amountOfActivations)}`;
  }

  override getText(eid = true): string {
    const text = `${VERB} ${this.getAmountOfActivationsText()} ${this.getCollectibleText(
      eid,
    )}`;
    return text;
  }

  fire(triggerData: TriggerData): void {
    const player = triggerData.player ?? Isaac.GetPlayer();
    const isCollectibleEffect = this.isCollectibleEffect();
    const collectible = this.calculateCollectible();

    if (collectible === undefined) {
      fprint("Collectible could not be found for RemoveCollectibleResponse.");
      return;
    }

    if (isCollectibleEffect) {
      fprint(
        `Trying to remove ${getCollectibleName(
          collectible,
        )} effect from player due to RemoveCollectibleResponse..`,
      );
      playerRemovePermanentCollectibleEffect(player, collectible);
    } else {
      fprint(
        `Trying to remove ${getCollectibleName(
          collectible,
        )} from player due to RemoveCollectibleResponse..`,
      );
      player.RemoveCollectible(collectible);
    }
  }
}
