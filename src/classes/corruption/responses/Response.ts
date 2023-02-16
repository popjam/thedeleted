import { CollectibleType } from "isaac-typescript-definitions";
import { deepCopy } from "isaacscript-common";
import { EIDColorShortcut } from "../../../enums/compatibility/EIDColor";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { getEIDColorShortcutFromMorality } from "../../../maps/compatibility/EIDColorMap";
import {
  createPercentage,
  Percentage,
  rollPercentage,
} from "../../../types/general/Percentage";
import {
  randomInRange,
  Range,
  rangeToString,
  validifyRange,
} from "../../../types/general/Range";

const DEFAULT_PERCENTAGE_CHANCE_TO_ACTIVATE = 100;
const DEFAULT_AMOUNT_OF_ACTIVATIONS = 1;
const DEFAULT_MORALITY = Morality.NEUTRAL;
const NO_CHANCE_TO_ACTIVATE_TEXT = "don't";
const CHANCE_TO_ACTIVATE_POST_TEXT = "% chance to";

/**
 * Responses are triggered using trigger() and correlate to an event occurring in game.
 *
 * @example 'Spawn 3 spiders'.
 *
 * Responses can also have additional properties which modify their behavior (e.g percentage chance
 * to fire upon triggering the response). Each response has a 'Morality', indicating if it is
 * beneficial or not.
 */
export abstract class Response {
  readonly responseType!: ResponseType;
  mo?: Morality;
  aoa?: number | Range;
  /** Percentage chance to activate (100% will always pass). */
  cta?: Percentage;
  /** Overridden color of the Response. Default is derived from the Morality. */
  oc?: EIDColorShortcut;

  /**
   * Get the assigned EID Color Shortcut used to represent the Response. This can either be derived
   * from the Morality or overridden with overrideTextColor(). Note if this Response is wrapped in
   * an Action, it will use the Actions textColor instead.
   */
  getTextColor(): EIDColorShortcut {
    return this.oc ?? getEIDColorShortcutFromMorality(this.getMorality());
  }

  /**
   * Override the text color generated to this Response through its Morality. Note if this Response
   * is wrapped in an Action, it will use the Actions textColor instead.
   */
  overrideTextColor(color: EIDColorShortcut): this {
    this.oc = color;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  getInvolvedCollectibles(): CollectibleType[] {
    return [];
  }

  // Use calculateAmountOfActivations() instead!
  getAmountOfActivations(): number | Range {
    return this.aoa ?? DEFAULT_AMOUNT_OF_ACTIVATIONS;
  }

  getAmountOfActivationsText(): string | undefined {
    const amountOfActivations = this.getAmountOfActivations();
    if (typeof amountOfActivations === "number") {
      if (amountOfActivations === 1) {
        return undefined;
      }
      return amountOfActivations.toString();
    }
    return rangeToString(amountOfActivations);
  }

  /**
   * Gets the amount of times the response will be fired. If the amountOfActivations is a Range,
   * returns a random number in the Range.
   */
  calculateAmountOfActivations(): number {
    const aoa = this.getAmountOfActivations();
    if (typeof aoa === "number") {
      return aoa;
    }
    return randomInRange(aoa);
  }

  /**
   * The amount of times it activates upon trigger(). Will validify ranges.
   *
   * @example "Spawn 2x spiders" --> 2 amountOfActivations.
   * @example "Spawn 1-3 spiders" --> [1,3] rangeOfActivations.
   */
  setAmountOfActivations(amount: number | Range): this {
    if (typeof amount === "number") {
      this.aoa = amount;
    } else {
      this.aoa = validifyRange(amount);
    }
    return this;
  }

  setMorality(morality: Morality): this {
    this.mo = morality;
    return this;
  }

  getMorality(): Morality {
    return this.mo ?? DEFAULT_MORALITY;
  }

  /**
   * The percentage chance that the Response is activated upon trigger(). Can be to 2 decimal
   * places.
   *
   * @example "50% chance to spawn a spider" --> 50 chanceToActivate.
   */
  setChanceToActivate(percentage: Percentage): this {
    this.cta = createPercentage(percentage);
    return this;
  }

  getChanceToActivate(): Percentage {
    return this.cta ?? DEFAULT_PERCENTAGE_CHANCE_TO_ACTIVATE;
  }

  getChanceToActivateText(): string {
    const chanceToActivate = this.getChanceToActivate();
    if (chanceToActivate === 100) {
      return "";
    }
    if (chanceToActivate === 0) {
      return NO_CHANCE_TO_ACTIVATE_TEXT;
    }
    return `${chanceToActivate}${CHANCE_TO_ACTIVATE_POST_TEXT}`;
  }

  /** Describes the Response in string format. */
  abstract getText(): string;

  deepCopy(): this {
    return deepCopy(this);
  }

  /**
   * Trigger the Response, which may or may not fire depending on certain Tags. Actions will use
   * this function to fire the Responses tied to them.
   */
  trigger(triggerData: TriggerData): void {
    // Percentage
    if (!rollPercentage(this.getChanceToActivate())) {
      return;
    }

    // Firing + AmountOfActivations
    const amountOfActivations = this.calculateAmountOfActivations();
    for (let i = 0; i < amountOfActivations; i++) {
      this.fire(triggerData);
    }
  }

  /** Fire the response. */
  abstract fire(triggerData: TriggerData): unknown;
}

/** Type guard. */
export function isResponse(obj: any): obj is Response {
  return "responseType" in obj;
}
