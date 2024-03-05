/* eslint-disable jsdoc/informative-docs */
import type { CollectibleType } from "isaac-typescript-definitions";
import type { EIDColorShortcut } from "../../../enums/compatibility/EID/EIDColor";
import type { ActionOriginType } from "../../../enums/corruption/actions/ActionOrigin";
import type { ActionType } from "../../../enums/corruption/actions/ActionType";
import { Morality } from "../../../enums/corruption/Morality";

import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { Range } from "../../../types/general/Range";
import {
  randomInRange,
  rangeToString,
  validifyRange,
} from "../../../types/general/Range";

import type { Response } from "../responses/Response";

const EMPTY_ACTION_MORALITY = Morality.NEUTRAL;
const TRIGGER_AFTER_THEN_REMOVE_ACTIVATION_NUMBER = 0;
const STARTING_INTERVAL_COUNTER_NUMBER = 1;
const DEFAULT_INTERVAL = 1;
const DEFAULT_FLAG_FOR_REMOVAL = false;
const NO_RESPONSE_TEXT = "do nothing";
const DEFAULT_PERMANENCE = false;

/**
 * Actions are containers which hold Responses. After the Action has passed all its 'checks', it
 * will trigger the responses it holds. Usually Actions are tied to Callbacks. Actions may also have
 * additional properties which modify their behavior.
 *
 * @example Every 3 - 5 rooms, trigger response.
 */
export abstract class Action {
  readonly actionType!: ActionType;
  r?: Response;
  oat?: string;
  o?: ActionOriginType;
  p?: boolean;
  oc?: EIDColorShortcut;

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
   * Will not be removed if the Action also has the 'permanent' tag enabled, but will stay flagged.
   *
   * @example In triggerAllPlayerActionsByType(), it will do a 'garbage disposal' at the end,
   *          removing actions with this tag from the player.
   */
  ffR?: boolean;

  /**
   * Get the assigned EID Color used to represent the Action. This can either be derived from the
   * Morality or overridden with overrideTextColor().
   */
  getTextColor(): EIDColorShortcut | undefined {
    return this.oc;
  }

  /** Override the text color generated to this Action through its Morality. */
  overrideTextColor(color: EIDColorShortcut): this {
    this.oc = color;
    return this;
  }

  /** Get collectibles involved in the Action and all its responses. */
  getInvolvedCollectibles(): readonly CollectibleType[] {
    const response = this.getResponse();
    if (response === undefined) {
      return [];
    }

    return response.getInvolvedCollectibles();
  }

  /** If an Action is permanent, it can not be rerolled or removed with Action-altering effects. */
  getPermanence(): boolean {
    return this.p ?? DEFAULT_PERMANENCE;
  }

  /** If an Action is permanent, it can not be rerolled or removed with Action-altering effects. */
  setPermanence(permanent: boolean): this {
    this.p = permanent;
    return this;
  }

  /** Adds a Response to the Action. */
  setResponse(response: Response): this {
    this.r = response;
    return this;
  }

  /** Get the Response attached to the Action. */
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

  /**
   * Whether the Action should remove itself after firing X times.
   *
   * @example 'Every 2 - 3 rooms' -> no FATR.
   * @example 'After 2 - 3 rooms' -> 1 FATR.
   * @example 'Every 2 - 3 rooms, up to three times' -> 3 FATR.
   */
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

  /**
   * Whether the Action should remove itself after firing X times.
   *
   * @example 'Every 2 - 3 rooms' -> no FATR.
   * @example 'After 2 - 3 rooms' -> 1 FATR.
   * @example 'Every 2 - 3 rooms, up to three times' -> 3 FATR.
   */
  setFireAfterThenRemove(fireAfterThenRemove: number): this {
    this.fatr = fireAfterThenRemove;
    return this;
  }

  /** Use calculateInterval() instead! */
  getInterval(): number | Range | undefined {
    return this.i;
  }

  /**
   * Returns the interval text based on the interval value. If the interval is undefined, an empty
   * string is returned. If the interval is a number and equals the default interval, an empty
   * string is returned. Otherwise, the interval value is converted to a string and appended with "
   * times".
   *
   * @returns The interval text.
   *
   * @example 1-3 -> "1-3 times"
   */
  getIntervalText(): string {
    const interval = this.getInterval();
    if (interval === undefined) {
      return "";
    }
    if (typeof interval === "number") {
      if (interval === DEFAULT_INTERVAL) {
        return "";
      }
      return `${interval.toString()} times`;
    }
    return `${rangeToString(interval)} times`;
  }

  /** Will validify ranges. */
  setInterval(interval: number | Range): this {
    this.ic = STARTING_INTERVAL_COUNTER_NUMBER;
    this.i = typeof interval === "number" ? interval : validifyRange(interval);
    return this;
  }

  // Only get the 'Action' part of the text, not including responses.
  abstract getActionText(): string;

  // Only get the 'Responses' part of the text.
  getResponseText(eid = true): string {
    const response = this.getResponse();
    return response === undefined
      ? NO_RESPONSE_TEXT
      : response.getText(eid, false);
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
    // Interval
    const interval = this.getInterval();
    if (interval !== undefined) {
      this.ic = 1 + (this.ic ?? STARTING_INTERVAL_COUNTER_NUMBER);
      if (
        this.ic >
        (typeof this.i === "number"
          ? (interval as number)
          : randomInRange(interval as Range))
      ) {
        this.ic = 1;
      } else {
        return;
      }
    }

    this.fire(triggerData);

    // Fire after then remove.
    const currentFireAfterThenRemove = this.getFireAfterThenRemove();
    if (currentFireAfterThenRemove !== undefined) {
      this.setFireAfterThenRemove(currentFireAfterThenRemove - 1);
      if (
        this.getFireAfterThenRemove() ===
        TRIGGER_AFTER_THEN_REMOVE_ACTIVATION_NUMBER
      ) {
        this.ffR = true;
      }
    }
  }

  /** Fire the action, triggering its responses. */
  fire(triggerData: TriggerData): void {
    this.getResponse()?.trigger(triggerData);
  }
}

/** Type guard. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isAction(obj: any): obj is Action {
  return "actionType" in obj;
}
