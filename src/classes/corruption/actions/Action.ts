import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { Morality } from "../../../enums/corruption/Morality";
// eslint-disable-next-line import/no-cycle
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import {
  randomInRange,
  Range,
  rangeToString,
  validifyRange,
} from "../../../types/general/Range";
// eslint-disable-next-line import/no-cycle
import { Response } from "../responses/Response";

const EMPTY_ACTION_MORALITY = Morality.NEUTRAL;
const TRIGGER_AFTER_THEN_REMOVE_ACTIVATION_NUMBER = 0;
const STARTING_INTERVAL_COUNTER_NUMBER = 1;
const DEFAULT_INTERVAL = 1;
const DEFAULT_FLAG_FOR_REMOVAL = false;
const NO_RESPONSE_TEXT = "do nothing";

export enum ActionOrigin {
  INVERTED_COLLECTIBLE,
}

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
  r?: Response;
  oat?: string;
  o?: [ActionOrigin, number];

  /**
   * When using getMorality() on the Action, this value will return instead of looking at the
   * Actions responses Moralities.
   */
  om?: Morality;

  /**
   * Distance between firing.
   *
   * @example "Every 3 rooms", get brimstone.
   * @example "Every 1-5 rooms", get brimstone.
   * @example If not specified defaults to every time: "Every room", get brimstone.
   */
  i?: Range | number;

  /**
   * Only fires after X triggers. Once triggered, will be removed.
   *
   * @example "After 3 rooms", get brimstone. --> activateAfter: 3
   */
  fatr?: number;

  /** Used by interval property, shouldn't be changed. */
  ic?: number;

  /**
   * Indicates that the Action should be removed from whatever list or container it is being held
   * in. If this is set to true, the Action will not be removed immediately.An Action itself does
   * not know where it is being stored: so it has to 'signal' to tell its outer components it should
   * be removed.
   *
   * @example In triggerAllPlayerActionsByType(), it will do a 'garbage disposal' at the end,
   *          removing actions with this tag from the player.
   */
  ffR?: boolean;

  /**
   * Adds one or more responses to the action. Can provide one response, multiple responses or an
   * array of responses.
   */
  setResponse(response: Response): this {
    this.r = response;
    return this;
  }

  getResponse(): Response | undefined {
    return this.r;
  }

  /** Overrides the 'Action' portion of the Action text (when called from getText()). */
  getOverriddenActionText(): string | undefined {
    return this.oat;
  }

  /** Overrides the 'Action' portion of the Action text (when called from getText()). */
  setOverriddenActionText(text: string): this {
    this.oat = text;
    return this;
  }

  /** If the Action wants to be removed. */
  getFlagForRemoval(): boolean {
    return this.ffR ?? DEFAULT_FLAG_FOR_REMOVAL;
  }

  flagForRemoval(): this {
    this.ffR = true;
    return this;
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

    if (this.om !== undefined) {
      return this.om;
    }

    return response.getMorality();
  }

  getOverriddenMorality(): Morality | undefined {
    return this.om;
  }

  setOverriddenMorality(morality: Morality): this {
    this.om = morality;
    return this;
  }

  getFireAfterThenRemove(): number | undefined {
    return this.fatr;
  }

  getFireAfterThenRemoveText(): string | undefined {
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove === undefined) {
      return undefined;
    }
    return `after ${fireAfterThenRemove}`;
  }

  setFireAfterThenRemove(fireAfterThenRemove: number): this {
    this.fatr = fireAfterThenRemove;
    return this;
  }

  /** Use calculateInterval() instead! */
  getInterval(): number | Range | undefined {
    return this.i;
  }

  getIntervalText(): string {
    const interval = this.getInterval();
    if (interval === undefined) {
      return "";
    }
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
    this.ic = STARTING_INTERVAL_COUNTER_NUMBER;
    if (typeof interval !== "number") {
      this.i = validifyRange(interval);
    } else {
      this.i = interval;
    }
    return this;
  }

  // Only get the 'Action' part of the text, not including responses.
  abstract getActionText(): string;

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
    const currentFireAfterThenRemove = this.getFireAfterThenRemove();
    if (currentFireAfterThenRemove !== undefined) {
      this.setFireAfterThenRemove(currentFireAfterThenRemove - 1);
      if (
        this.getFireAfterThenRemove() ===
        TRIGGER_AFTER_THEN_REMOVE_ACTIVATION_NUMBER
      ) {
        this.ffR = true;
      } else {
        return;
      }
    }

    // Interval
    const interval = this.getInterval();
    if (interval !== undefined) {
      this.ic = 1 + (this.ic ?? STARTING_INTERVAL_COUNTER_NUMBER);
      if (
        this.ic >
        (typeof this.i === "number"
          ? interval
          : randomInRange(interval as Range))
      ) {
        this.ic = 1;
      } else {
        return;
      }
    }

    this.fire(triggerData);
  }

  /** Fire the action, triggering its responses. */
  fire(triggerData: TriggerData): void {
    this.getResponse()?.fire(triggerData);
  }
}

/** Type guard. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isAction(obj: any): obj is Action {
  return "actionType" in obj;
}
