import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { Morality } from "../../../enums/corruption/Morality";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Percentage } from "../../../types/general/Percentage";
import {
  randomInRange,
  Range,
  rangeToString,
  validifyRange,
} from "../../../types/general/Range";
import { Response } from "../responses/Response";

const EMPTY_ACTION_MORALITY = Morality.NEUTRAL;
const TRIGGER_AFTER_THEN_REMOVE_ACTIVATION_NUMBER = 0;
const STARTING_INTERVAL_COUNTER_NUMBER = 1;
const DEFAULT_INTERVAL = 1;
const DEFAULT_PERCENTAGE_CHANCE_TO_ACTIVATE = 100;
const DEFAULT_FLAG_FOR_REMOVAL = false;
const NO_RESPONSE_TEXT = "do nothing";

/**
 * Actions are containers which hold Responses. After the Action has passed all its 'checks', it
 * will trigger the responses it holds. Usually Actions are tied to Callbacks. Actions may also have
 * additional properties which modify their behavior.
 *
 * @example Every 3 - 5 rooms.
 *
 * If there are multiple responses in an action, only one of the responses will fire every time,
 * chosen randomly. Certain tags may modify this behavior.
 */
export abstract class Action {
  readonly actionType!: ActionType;
  response?: Response;

  // E.g every 3 triggers. Used for text.
  verb = "every";
  noun = "trigger";
  nounPlural = "triggers";

  /**
   * When using getMorality() on the Action, this value will return instead of looking at the
   * Actions responses Moralities.
   */
  overriddenMorality?: Morality;

  /**
   * Distance between firing.
   *
   * @example "Every 3 rooms", get brimstone.
   * @example "Every 1-5 rooms", get brimstone.
   * @example If not specified defaults to every time: "Every room", get brimstone.
   */
  interval: Range | number = DEFAULT_INTERVAL;

  /**
   * Only fires after X triggers. Once triggered, will be removed.
   *
   * @example "After 3 rooms", get brimstone. --> activateAfter: 3
   */
  fireAfterThenRemove?: number;

  /** Used by interval property, shouldn't be changed. */
  intervalCounter = STARTING_INTERVAL_COUNTER_NUMBER;

  /**
   * Indicates that the Action should be removed from whatever list or container it is being held
   * in. If this is set to true, the Action will not be removed immediately.An Action itself does
   * not know where it is being stored: so it has to 'signal' to tell its outer components it should
   * be removed.
   *
   * @example In triggerAllPlayerActionsByType(), it will do a 'garbage disposal' at the end,
   *          removing actions with this tag from the player.
   */
  flagForRemoval = DEFAULT_FLAG_FOR_REMOVAL;

  /** Percentage chance to activate (100% will always pass). */
  chanceToActivate: Percentage = DEFAULT_PERCENTAGE_CHANCE_TO_ACTIVATE;

  /**
   * Adds one or more responses to the action. Can provide one response, multiple responses or an
   * array of responses.
   */
  setResponse(response: Response): this {
    this.response = response;
    return this;
  }

  getResponse(): Response | undefined {
    return this.response;
  }

  /**
   * Gets the general morality of the Action by looking at the responses. If there are multiple
   * responses, and they differ in Morality, it will return 'Neutral'. If there is an overridden
   * morality, returns that instead. An overridden Morality can be given to the Action with
   * setOverriddenMorality(). Note this will not auto-update if more responses are added.
   */
  getMorality(): Morality {
    const response = this.getResponse();
    if (response === undefined) {
      return EMPTY_ACTION_MORALITY;
    }

    if (this.overriddenMorality !== undefined) {
      return this.overriddenMorality;
    }

    return response.getMorality();
  }

  getOverriddenMorality(): Morality | undefined {
    return this.overriddenMorality;
  }

  setOverriddenMorality(morality: Morality): this {
    this.overriddenMorality = morality;
    return this;
  }

  getFireAfterThenRemove(): number | undefined {
    return this.fireAfterThenRemove;
  }

  getFireAfterThenRemoveText(): string | undefined {
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove === undefined) {
      return undefined;
    }
    return `after ${fireAfterThenRemove}`;
  }

  setFireAfterThenRemove(fireAfterThenRemove: number): this {
    this.fireAfterThenRemove = fireAfterThenRemove;
    return this;
  }

  /** Use calculateInterval() instead! */
  getInterval(): number | Range {
    return this.interval;
  }

  getIntervalText(): string {
    const interval = this.getInterval();
    if (typeof interval === "number") {
      if (interval === DEFAULT_INTERVAL) {
        return "";
      }
      return interval.toString();
    }
    return rangeToString(interval);
  }

  /** Will validify ranges. */
  setInterval(interval: number | Range): this {
    if (typeof interval !== "number") {
      this.interval = validifyRange(interval);
    } else {
      this.interval = interval;
    }
    return this;
  }

  /**
   * Returns the interval between activations. If it is a Range, returns a random number in the
   * range.
   */
  calculateInterval(): number {
    if (typeof this.interval !== "number") {
      return randomInRange(this.interval);
    }
    return this.interval;
  }

  // Only get the 'Action' part of the text, not including responses.
  getActionText(): string {
    let text = "";
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove !== undefined) {
      if (fireAfterThenRemove === 1) {
        text += `next ${this.noun}`;
      } else {
        text += `after ${fireAfterThenRemove} ${this.nounPlural}`;
      }
    } else {
      const intervalText = this.getIntervalText();
      if (intervalText === "") {
        text += `${this.verb} ${this.noun}`;
      } else {
        text += `${this.verb} ${intervalText} ${this.nounPlural}`;
      }
    }
    text += ", ";
    return text;
  }

  // Only get the 'Responses' part of the text.
  getResponseText(): string {
    const response = this.getResponse();
    return response !== undefined ? response.getText() : NO_RESPONSE_TEXT;
  }

  getText(): string {
    return `${this.getActionText()} ${this.getResponseText()}`;
  }

  /**
   * Triggers the action, which may or may not fire the actions responses. Tag order:
   *
   * @example Trigger after then remove.
   * @example Interval.
   * @example Fire.
   */
  trigger(triggerData: TriggerData): void {
    // Trigger after then remove.
    if (this.fireAfterThenRemove !== undefined) {
      this.fireAfterThenRemove--;
      if (
        this.fireAfterThenRemove === TRIGGER_AFTER_THEN_REMOVE_ACTIVATION_NUMBER
      ) {
        this.flagForRemoval = true;
      }
      return;
    }

    // Interval
    this.intervalCounter++;
    if (this.intervalCounter > this.calculateInterval()) {
      this.intervalCounter = 1;
    } else {
      return;
    }

    this.fire(triggerData);
  }

  /** Fire the action, triggering its responses. */
  fire(triggerData: TriggerData): void {
    this.getResponse()?.fire(triggerData);
  }
}

/** Type guard. */
export function isAction(obj: any): obj is Action {
  return "actionType" in obj;
}
