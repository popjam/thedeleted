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
import type { Range } from "../../../types/general/Range";
import type { Morality } from "../../../enums/corruption/Morality";

const VERB = "lose";
const VERB_PARTICIPLE = "losing";
const DEFAULT_CE = false;

/**
 * Response for removing a collectible from the player. If the player does not have the collectible,
 * nothing happens. The collectible can be in the form of a CollectibleType, a Collectible Effect,
 * or a CollectibleAttribute.
 *
 * @example Remove The Poop.
 * @example Remove the Poop effect.
 *
 * @param c The collectible to remove. Can be a CollectibleType, a CollectibleAttribute, or
 *          undefined.
 * @param ce Whether the collectible is a Collectible Effect. Default is false.
 */
export class RemoveCollectibleResponse extends Response {
  override responseType: ResponseType = ResponseType.REMOVE_COLLECTIBLE;
  c?: CollectibleType | CollectibleAttribute;
  ce?: boolean;

  /**
   * Response for removing a collectible from the player. If the player does not have the
   * collectible, nothing happens. The collectible can be in the form of a CollectibleType, a
   * Collectible Effect, or a CollectibleAttribute.
   *
   * @example Remove The Poop.
   * @example Remove the Poop effect.
   *
   * @param collectibleToRemove The collectible to remove. Can be a CollectibleType, a
   *                            CollectibleAttribute, or undefined.
   * @param amount The amount of times this Response can be activated. Default is 1.
   * @param morality The morality of this Response. Default is Morality.NEUTRAL.
   * @param isEffect Whether the collectible is a Collectible Effect. Default is false.
   */
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

  override getNoun(eid = true): string {
    const collectible = this.getCollectible();
    const isMultiple = this.isMultiple();
    const amountOfActivationsText = this.getAmountOfActivationsText() ?? "";

    // CollectibleAttribute
    if (typeof collectible === "object") {
      return `${amountOfActivationsText} ${collectibleAttributeToText(
        collectible,
        isMultiple,
      )}`;
    }

    // Random.
    if (collectible === undefined) {
      if (isMultiple) {
        return `${amountOfActivationsText} random collectibles`;
      }

      return "a random collectible";
    }

    // Specific collectible.
    const collectibleName = getCollectibleNameWithEIDSetting(
      collectible,
      isMultiple,
      eid,
    );
    return `${amountOfActivationsText} ${collectibleName}`;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getText(eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun(eid);
    const chanceToActivate = this.getChanceToActivateText(participle);

    return `${chanceToActivate} ${verb} ${noun}`;
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
