import { deepCopy } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
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
  morality?: Morality;
  amountOfActivations: number | Range = DEFAULT_AMOUNT_OF_ACTIVATIONS;
  /** Percentage chance to activate (100% will always pass). */
  chanceToActivate: Percentage = DEFAULT_PERCENTAGE_CHANCE_TO_ACTIVATE;

  // Use calculateAmountOfActivations() instead!
  getAmountOfActivations(): number | Range {
    return this.amountOfActivations;
  }

  getAmountOfActivationsText(): string {
    const amountOfActivations = this.getAmountOfActivations();
    if (typeof amountOfActivations === "number") {
      if (amountOfActivations === 1) {
        return "";
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
    const { amountOfActivations } = this;
    if (typeof amountOfActivations === "number") {
      return amountOfActivations;
    }
    return randomInRange(amountOfActivations);
  }

  /**
   * The amount of times it activates upon trigger(). Will validify ranges.
   *
   * @example "Spawn 2x spiders" --> 2 amountOfActivations.
   * @example "Spawn 1-3 spiders" --> [1,3] rangeOfActivations.
   */
  setAmountOfActivations(amount: number | Range): this {
    if (typeof amount === "number") {
      this.amountOfActivations = amount;
    } else {
      this.amountOfActivations = validifyRange(amount);
    }
    return this;
  }

  setMorality(morality: Morality): this {
    this.morality = morality;
    return this;
  }

  getMorality(): Morality {
    return this.morality ?? DEFAULT_MORALITY;
  }

  /**
   * The percentage chance that the Response is activated upon trigger(). Can be to 2 decimal
   * places.
   *
   * @example "50% chance to spawn a spider" --> 50 chanceToActivate.
   */
  setChanceToActivate(percentage: Percentage): this {
    this.chanceToActivate = createPercentage(percentage);
    return this;
  }

  getChanceToActivate(): Percentage {
    return this.chanceToActivate;
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
  abstract getText(overrideAmountOfActivations?: number | Range): string;

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
