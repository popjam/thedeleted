import type { CollectibleType } from "isaac-typescript-definitions";
import { deepCopy } from "isaacscript-common";
import type { EIDColorShortcut } from "../../../enums/compatibility/EID/EIDColor";
import { Morality } from "../../../enums/corruption/Morality";
import type { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { fprint } from "../../../helper/printHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { Percentage } from "../../../types/general/Percentage";
import {
  createPercentage,
  rollPercentage,
} from "../../../types/general/Percentage";
import type { Range } from "../../../types/general/Range";
import {
  randomInRange,
  rangeToString,
  validifyRange,
} from "../../../types/general/Range";
import {
  DEFAULT_NEGATIVE_MISMATCH_BUFFER,
  DEFAULT_POSITIVE_MISMATCH_BUFFER,
  QUALITY_2_ITEM_SEVERITY,
} from "../../../constants/severityConstants";
import {
  SHUFFLE_RESPONSE_CHANCE_FOR_CHANCE_TO_FIRE,
  SHUFFLE_RESPONSE_CHANCE_FOR_MULTIPLE_ACTIVATIONS,
} from "../../../constants/corruptionConstants";

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
  abstract readonly responseType: ResponseType;
  mo?: Morality;
  aoa?: number | Range;

  /** Percentage chance to activate (100% will always pass). */
  cta?: Percentage;

  /** Overridden color of the Response. Default is derived from the Morality. */
  oc?: EIDColorShortcut;

  /**
   * Get the Response's 'severity'. Severity is the measure of how gamebreaking / detrimental a
   * Response is for a particular run. On this scale, 0 is completely neutral, 100 is completely
   * positively gamebreaking, and -100 will completely decimate a run.
   *
   * E.g 'Spawn 3 spiders' -> Severity -5.
   *
   * E.g 'Spawn 3 items' -> Severity 30.
   *
   * E.g 'Use Death Certificate' -> Severity 50.
   *
   * E.g 'Play X Sound' -> Severity 0.
   *
   * The 'percentage' and 'amountOfActivations' properties also modify the severity of the Response.
   */
  getSeverity(responseSeverity = 0): number {
    let amountOfActivations = this.getAmountOfActivations();
    const chanceToActivate = this.getChanceToActivate();

    // If amountOfActivations is a range, we'll use the median value.
    if (typeof amountOfActivations !== "number") {
      const [min, max] = amountOfActivations;
      amountOfActivations = (min + max) / 2;
    }

    responseSeverity *= amountOfActivations;
    responseSeverity *= chanceToActivate / 100;

    return responseSeverity;
  }

  getAbsoluteSeverity(): number {
    return Math.abs(this.getSeverity());
  }

  /**
   * Adjust the severity of the Response by changing its amount of activations or chance to
   * activate. If the ideal severity is higher than the current severity, the Response will have its
   * amount of activations increased. If the ideal severity is lower than the current severity, the
   * Response will have its chance to activate increased.
   *
   * @param idealSeverity The severity you want to adjust the Response to.
   * @param randomize If ideal severity > current severity, then the ideal severity can be any value
   *                  from actual ideal severity to current severity. If ideal severity < current
   *                  severity. For example, if the ideal severity is ON_FLOOR (100) and the current
   *                  severity is ON_ROOM (5), the ideal severity can be any value from 5 to 100,
   *                  meaning the Response amount of activations will be anywhere from 1 to 20.
   * @returns The mismatch between the ideal severity and the current severity (after adjustments).
   *          For example, if the ideal severity is 10 and the current severity is 5, the mismatch
   *          will be 5. If the ideal severity is 5 and the current severity is 10, the mismatch
   *          will be -5. In general, you want a positive mismatch over a negative one, as a
   *          negative mismatch means the Response is too severe (positively or negatively).
   */
  adjustSeverity(
    idealSeverity = QUALITY_2_ITEM_SEVERITY * 4,
    randomize = true,
  ): number {
    const currentSeverity = this.getAbsoluteSeverity();
    const currentAmountOfActivations = this.getAmountOfActivationsAverage();
    const currentChanceToActivate = this.getChanceToActivate();
    const currentMismatch = idealSeverity - currentSeverity;

    if (currentSeverity === 0 || idealSeverity === 0) {
      return currentMismatch;
    }

    // If the ideal severity is higher than the current severity, increase the amount of
    // activations.
    if (idealSeverity > currentSeverity) {
      // If randomize is true, the ideal severity can be any value from actual ideal severity to
      // current severity.
      if (randomize) {
        idealSeverity = randomInRange([currentSeverity, idealSeverity]);
      }

      const newAmountOfActivations = Math.floor(
        (idealSeverity / currentSeverity) * currentAmountOfActivations,
      );
      this.setAmountOfActivations(newAmountOfActivations);
      return this.getSeverityMismatch(idealSeverity);
    }

    // If the ideal severity is lower than the current severity, increase the chance to activate.
    // For example, if the ideal severity is 5 and the current severity is 10, the chance to
    // activate will be 50%.
    const newChanceToActivate =
      (idealSeverity / currentSeverity) * currentChanceToActivate;
    this.setChanceToActivate(newChanceToActivate);
    return this.getSeverityMismatch(idealSeverity);
  }

  /**
   * Get the mismatch between the ideal severity and the current severity (after adjustments). For
   * example, if the ideal severity is 10 and the current severity is 5, the mismatch will be 5. If
   * the ideal severity is 5 and the current severity is 10, the mismatch will be -5. In general,
   * you want a positive mismatch over a negative one, as a negative mismatch means the Response is
   * too severe (positively or negatively).
   */
  getSeverityMismatch(idealSeverity: number): number {
    return idealSeverity - this.getSeverity();
  }

  /**
   * Get the assigned EID Color Shortcut used to represent the Response. This can either be derived
   * from the Morality or overridden with overrideTextColor(). Note if this Response is wrapped in
   * an Action, it will use the Actions textColor instead.
   */
  getTextColor(): EIDColorShortcut | undefined {
    return this.oc;
  }

  /**
   * Override the text color generated to this Response through its Morality. Note if this Response
   * is wrapped in an Action, it will use the Actions textColor instead.
   */
  overrideTextColor(color: EIDColorShortcut): this {
    this.oc = color;
    return this;
  }

  getInvolvedCollectibles(): readonly CollectibleType[] {
    return [];
  }

  /**
   * Whether to flatten the results of the triggered Response into a singular array. This method is
   * overridden by some Responses. It will flatten the results with a depth of 1.
   *
   * Flattened Responses will usually be ones which trigger other Responses, such as
   * TriggerInQueueResponse, as the results of the triggered Response will be an array, and we don't
   * want to return an array of arrays.
   *
   * This can mean the final returned array may consist of different types of values, so caution
   * should be taken when using those kind of Responses and their return values.
   */
  shouldFlattenResults(): boolean {
    return false;
  }

  /**
   * Whether to skip the amount of activations causing the 'fire()' function to be called multiple
   * times in the trigger() function. This method is overridden by some Responses, particularly
   * those that recreate the amount of activations in their overridden fire() function.
   */
  shouldSkipAmountOfActivations(): boolean {
    return false;
  }

  // Use calculateAmountOfActivations() instead!
  getAmountOfActivations(): number | Range {
    return this.aoa ?? DEFAULT_AMOUNT_OF_ACTIVATIONS;
  }

  /**
   * Calculates the average amount of activations. If the result of `getAmountOfActivations` is a
   * number, it returns that number. Otherwise, it returns the average of the Range.
   *
   * @returns The average amount of activations.
   */
  getAmountOfActivationsAverage(): number {
    const aoa = this.getAmountOfActivations();
    if (typeof aoa === "number") {
      return aoa;
    }
    return (aoa[0] + aoa[1]) / 2;
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
    this.aoa = typeof amount === "number" ? amount : validifyRange(amount);
    if (this.aoa === 1) {
      this.aoa = undefined;
    }
    return this;
  }

  // Override the calculated Morality.
  setMorality(morality: Morality): this {
    this.mo = morality;
    return this;
  }

  // Morality is positive if the Response has a positive severity, and negative if the Response has
  // a negative severity.
  getMorality(): Morality {
    const severity = this.getSeverity();
    if (severity === 0) {
      return DEFAULT_MORALITY;
    }

    return severity > 0 ? Morality.POSITIVE : Morality.NEGATIVE;
  }

  /** Returns true if the 'amountOfActivations' is either more than 1, or a Range. */
  isMultiple(): boolean {
    return this.getAmountOfActivations() !== 1;
  }

  /**
   * The percentage chance that the Response is activated upon trigger(). Can be to 2 decimal
   * places.
   *
   * @example "50% chance to spawn a spider" --> 50 chanceToActivate.
   */
  setChanceToActivate(percentage: Percentage): this {
    // Round to 2 decimal places if it is under 1% or over 99%.
    percentage =
      percentage < 1 || percentage > 99
        ? Math.round(percentage * 100) / 100
        : Math.round(percentage);
    this.cta = createPercentage(percentage);
    return this;
  }

  getChanceToActivate(): Percentage {
    return this.cta ?? DEFAULT_PERCENTAGE_CHANCE_TO_ACTIVATE;
  }

  /**
   * Retrieves the chance to activate text based on the chance to activate value.
   *
   * @returns The chance to activate text.
   * @example
   * const response = new Response();
   * const chanceToActivateText = response.getChanceToActivateText();
   * console.log(chanceToActivateText); // "50% chance to"
   */
  getChanceToActivateText(_participle = false): string {
    const chanceToActivate = this.getChanceToActivate();
    if (chanceToActivate === 100) {
      return "";
    }
    if (chanceToActivate === 0) {
      return NO_CHANCE_TO_ACTIVATE_TEXT;
    }
    return `${chanceToActivate}${CHANCE_TO_ACTIVATE_POST_TEXT}`;
  }

  /**
   * Shuffle the parameters of the Response. This is used to randomize the Response's behavior. Note
   * that this will NOT shuffle the Response's chance to activate or amount of activations, as they
   * are used to adjust the severity of the Response.
   */
  shuffle(): this {
    if (rollPercentage(SHUFFLE_RESPONSE_CHANCE_FOR_CHANCE_TO_FIRE)) {
      this.setChanceToActivate(randomInRange([0, 100]));
    }

    if (rollPercentage(SHUFFLE_RESPONSE_CHANCE_FOR_MULTIPLE_ACTIVATIONS)) {
      this.setAmountOfActivations(randomInRange([1, 10]));
    }

    return this;
  }

  abstract getVerb(participle: boolean): string;

  abstract getNoun(eid: boolean): string;

  /** Class 'constructor()' behavior is unwanted so we have to create an alternate constructor. */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  abstract construct(...any: any): this;

  /**
   * Describes the Response in string format.
   *
   * @param eid Whether to use EID formatting.
   * @param participle Whether to use the participle form of the verb (e.g 'getting' instead of
   *                   'get').
   */
  abstract getText(eid: boolean, participle: boolean): string;

  deepCopy(): this {
    return deepCopy(this);
  }

  /**
   * Trigger the Response, which may or may not fire depending on certain Tags. Actions will use
   * this function to fire the Responses tied to them.
   */
  trigger(triggerData: TriggerData = {}): unknown[] {
    fprint(`Triggering Response: ${this.getText(false, false)}.`);

    // Percentage
    if (!rollPercentage(this.getChanceToActivate())) {
      fprint(
        `Failed to activate Response due to ${this.getChanceToActivateText()} chance to activate.`,
      );
      return [];
    }

    // Firing + AmountOfActivations
    const amountOfActivations = this.shouldSkipAmountOfActivations()
      ? 1
      : this.calculateAmountOfActivations();

    fprint(`Firing Response ${amountOfActivations} times.`);

    const returnValues: unknown[] = [];
    for (let i = 0; i < amountOfActivations; i++) {
      fprint(`Firing Response: ${this.getText(false, false)}.`);
      const returnValue = this.fire(triggerData);

      // Don't include 'undefined' return values in array.
      if (returnValue !== undefined) {
        returnValues.push(returnValue);
      }
    }

    // Flatten the array of return values if necessary.
    if (this.shouldFlattenResults()) {
      fprint("Flattening Response return values.");
      return returnValues.flat(1);
    }

    return returnValues;
  }

  /** Fire the response. */
  abstract fire(triggerData: TriggerData): unknown;
}

/** Type guard. */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function isResponse(obj: any): obj is Response {
  return "responseType" in obj;
}
