import type { CollectibleType } from "isaac-typescript-definitions";
import { GAME_FRAMES_PER_SECOND, isNumber } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";
import {
  randomInRangeWithDecimalPrecision,
  rangeToString,
} from "../../../types/general/Range";
import type { Range } from "../../../types/general/Range";
import { Response } from "./Response";

const DEFAULT_WAIT_TIME_SECONDS = 1;
const NO_RESPONSE_MORALITY = Morality.NEUTRAL;
const VERB = "wait";
const VERB_PARTICIPLE = "waiting";
const EMPTY_RESPONSE_TEXT = "do nothing";

/**
 * Waits a set amount of seconds, and then triggers the Response contained inside it. Note: If there
 * is more than one amountOfActivations, will wait then trigger them all at once.
 *
 * To get the behavior of wait, do X, wait, do X, wait, do X, then use TriggerOverIntervalResponse.
 *
 * @param response The Response to trigger after the wait.
 * @param secondsWait The amount of seconds to wait before the Response triggers. Can be a Range, in
 *                    which case a random number will be chosen from the range to a decimal
 *                    precision of 1.
 */
export class WaitThenTriggerResponse extends Response {
  override responseType: ResponseType = ResponseType.WAIT_THEN_TRIGGER;
  r?: Response;
  sW?: number | Range;

  construct(response: Response, secondsWait?: number): this {
    if (secondsWait !== undefined) {
      this.sW = secondsWait;
    }
    this.r = response;
    return this;
  }

  override getInvolvedCollectibles(): readonly CollectibleType[] {
    return this.getResponse()?.getInvolvedCollectibles() ?? [];
  }

  /** The amount of seconds to wait before the Response triggers. */
  setSecondsToWait(seconds: number | Range): this {
    this.sW = seconds;
    return this;
  }

  /** The amount of seconds to wait before the Response triggers. */
  getSecondsToWait(): number | Range {
    return this.sW ?? DEFAULT_WAIT_TIME_SECONDS;
  }

  getResponse(): Response | undefined {
    return this.r;
  }

  setResponse(response: Response): this {
    this.r = response;
    return this;
  }

  calculateSecondsToWait(): number {
    const secondsWait = this.getSecondsToWait();
    return isNumber(secondsWait)
      ? secondsWait
      : randomInRangeWithDecimalPrecision(secondsWait, 1);
  }

  /** This response should not have more than one AmountOfActivations. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setAmountOfActivations(amount: number | Range): this {
    error(
      "WaitThenTriggerResponse should not have more than one AmountOfActivations.",
    );
  }

  getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getNoun(): string {
    error("WaitThenTriggerResponse should not have a noun.");
  }

  /** The amount of seconds to wait before the Response triggers. */
  getWaitText(participle: boolean): string {
    const secondsWait = this.getSecondsToWait();
    const secondsWaitText = isNumber(secondsWait)
      ? secondsWait
      : rangeToString(secondsWait);
    return `${this.getVerb(participle)} ${secondsWaitText} ${addTheS(
      "second",
      isNumber(secondsWait) ? secondsWait : true,
    )}, then `;
  }

  getResponseText(eid: boolean, participle: boolean): string {
    return this.getResponse()?.getText(eid, participle) ?? EMPTY_RESPONSE_TEXT;
  }

  getText(eid: boolean, participle: boolean): string {
    return ` ${this.getWaitText(participle)} ${this.getResponseText(
      eid,
      participle,
    )}`;
  }

  /**
   * Returns its set morality, if a morality is not set returns its responses morality, if there is
   * no response morality, returns a default morality.
   */
  override getMorality(): Morality {
    return this.mo ?? this.getResponse()?.getMorality() ?? NO_RESPONSE_MORALITY;
  }

  override shouldFlattenResults(): boolean {
    return true;
  }

  override trigger(triggerData?: TriggerData): [] {
    return super.trigger(triggerData) as [];
  }

  fire(triggerData: TriggerData): void {
    const response = this.getResponse();
    if (response !== undefined) {
      mod.runInNGameFrames(() => {
        response.trigger(triggerData);
      }, GAME_FRAMES_PER_SECOND * this.calculateSecondsToWait());
    }
  }
}
