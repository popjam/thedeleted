import type { CollectibleType } from "isaac-typescript-definitions";
import type { EIDColorShortcut } from "../../../enums/compatibility/EID/EIDColor";
import { ActionOrigin } from "../../../enums/corruption/actions/ActionOrigin";
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
import { arrayEquals } from "isaacscript-common";
import { rollPercentage } from "../../../types/general/Percentage";

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

  /** How frequently the Action occurs. */
  abstract readonly actFr: number;

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
   * Only fires after X triggers. Once triggered, will be disabled.
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
   * Gets the severity of the Action. This will be the ideal severity of the Action's Responses. The
   * higher the severity, the less frequent the Action 1
   *
   * @returns The severity of the action.
   */
  getIdealSeverity(frequency?: number): number {
    frequency ??= this.actFr;

    const distance = this.getInterval();
    if (distance === undefined) {
      return frequency;
    }

    if (typeof distance === "number") {
      return distance * frequency;
    }

    const median = (distance[0] + distance[1]) / 2;
    return median * frequency;
  }

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

  /** Get the origin of the Action. */
  getOrigin(): ActionOriginType | undefined {
    return this.o;
  }

  /**
   * Retrieves the ID of the temporary action origin, if it exists.
   *
   * @returns The ID of the temporary action origin, or undefined if it doesn't exist.
   */
  getTemporaryActionID(): int | undefined {
    const origin = this.getOrigin();
    if (origin === undefined) {
      return undefined;
    }

    const [actionOrigin, id] = origin;
    return actionOrigin === ActionOrigin.TEMPORARY_ACTION ? id : undefined;
  }

  /**
   * Checks if the origin of the action matches the specified origin type.
   *
   * @param origin The origin type to compare against (e.g [ActionOrigin.TEMPORARY_ACTION, 5]).
   * @returns Returns `true` if the origin matches, `false` otherwise. If the action has no origin,
   *          returns `false`.
   */
  doesOriginMatch(origin: ActionOriginType): boolean {
    const actionOrigin = this.getOrigin();
    if (actionOrigin === undefined) {
      return false;
    }

    return arrayEquals(actionOrigin, origin);
  }

  /**
   * Sets the origin of the Action to a temporary action with the given ID. This will override any
   * previous origin.
   *
   * @param id The ID of the temporary action origin.
   * @returns The Action instance, for chaining.
   */
  setTemporaryActionID(id: int): this {
    this.o = [ActionOrigin.TEMPORARY_ACTION, id];
    return this;
  }

  /**
   * Retrieves the ID of the inverted collectible origin, if it exists.
   *
   * @returns The ID of the inverted collectible origin, or undefined if it doesn't exist.
   */
  getInvertedCollectibleOrigin(): int | undefined {
    const origin = this.getOrigin();
    if (origin === undefined) {
      return undefined;
    }

    const [actionOrigin, id] = origin;
    return actionOrigin === ActionOrigin.INVERTED_COLLECTIBLE ? id : undefined;
  }

  /**
   * Checks if the action is from an inverted collectible.
   *
   * @returns A boolean indicating whether the action is from an inverted collectible.
   */
  isFromInvertedCollectible(): boolean {
    return this.getInvertedCollectibleOrigin() !== undefined;
  }

  /** If an Action is permanent, it can not be rerolled or removed with Action-altering effects. */
  isPermanent(): boolean {
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

  /** If the Action wants to be removed. */
  setFlagForRemoval(flag: boolean): this {
    this.ffR = flag || undefined;
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

  // Function to get the "trigger" part of the action text.
  protected getTriggerText(intervalText: string): string {
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove !== undefined) {
      return fireAfterThenRemove === 1
        ? `the next time ${this.getTriggerClause()}`
        : `for the next ${fireAfterThenRemove} times ${this.getTriggerClause()}`;
    }
    if (intervalText !== "") {
      return `every ${intervalText} times ${this.getTriggerClause()}`;
    }
    return `every time ${this.getTriggerClause()}`;
  }

  // Function to get the specific trigger clause for the action type.
  protected abstract getTriggerClause(): string;

  // Get the action text.
  getActionText(): string {
    // If overridden, use the overridden text.
    if (this.oat !== undefined) {
      return this.oat;
    }

    // Get interval text.
    const intervalText = this.getIntervalText();

    // Combine trigger text and interval text.
    let text = this.getTriggerText(intervalText);

    text += ", "; // Add comma and space for consistency.
    return text;
  }

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
   * Shuffles the Action's parameters. This is useful in corrupted item generation.
   *
   * For example, for 'OnRoomAction', this would shuffle the RoomType, with a chance of removing the
   * RoomType entirely.
   */
  shuffle(): this {
    const CHANCE_FOR_FIRE_AFTER_THEN_REMOVE = 1;
    const CHANCE_FOR_INTERVAL = 20;

    if (rollPercentage(CHANCE_FOR_FIRE_AFTER_THEN_REMOVE)) {
      this.setFireAfterThenRemove(randomInRange([1, 3]));
    }

    if (rollPercentage(CHANCE_FOR_INTERVAL)) {
      const CHANCE_FOR_RANGE = 50;
      if (rollPercentage(CHANCE_FOR_RANGE)) {
        this.setInterval([1, 3]);
      } else {
        this.setInterval(randomInRange([1, 3]));
      }
    }

    return this;
  }

  /**
   * Triggers the action, which may or may not fire the actions responses. Tag order:
   *
   * @example Trigger after then remove.
   * @example Interval.
   * @example Fire.
   */
  trigger(triggerData: TriggerData): unknown {
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

    return true;
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
