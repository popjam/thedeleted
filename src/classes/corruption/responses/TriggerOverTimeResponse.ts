import type { CollectibleType } from "isaac-typescript-definitions";
import { GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";
import type { Range } from "../../../types/general/Range";
import { Response } from "./Response";

const DEFAULT_INTERVAL_TIMES = 1;
const DEFAULT_TOTAL_TIME = 60;
const NO_RESPONSE_MORALITY = Morality.NEUTRAL;
const EMPTY_RESPONSE_TEXT = "do nothing";
const EMPTY_RESPONSE_TEXT_PARTICIPLE = "doing nothing";

/**
 * Triggers the set Response a set amount of times (amountOfTriggers) with a waiting period between
 * each activation (intervalTime).
 *
 * The Response does not trigger immediately, instead waits X interval seconds.
 */
export class TriggerOverTimeResponse extends Response {
  override responseType: ResponseType = ResponseType.WAIT_THEN_TRIGGER;
  private r?: Response;
  private it?: number;
  private tt?: number;
  private ct?: number;

  construct(
    response: Response,
    amountOfTriggers?: number,
    intervalTimeSec?: number,
  ): this {
    if (intervalTimeSec !== undefined) {
      this.it = intervalTimeSec;
    }
    // Amount of triggers x Interval between triggers = Total time.
    if (amountOfTriggers !== undefined) {
      this.tt = amountOfTriggers * this.getIntervalTimeSec();
    }
    this.ct = this._getTotalTimeSec();
    this.r = response;
    return this;
  }

  override getInvolvedCollectibles(): readonly CollectibleType[] {
    return this.getResponse()?.getInvolvedCollectibles() ?? [];
  }

  /** Ticks down the timer. If below or equal to 0, returns false. */
  tick(): boolean {
    this.ct = (this.ct ?? DEFAULT_TOTAL_TIME) - this.getIntervalTimeSec();
    return this.ct >= 0;
  }

  setIntervalTimeSec(seconds: number): this {
    this.it = seconds;
    return this;
  }

  getIntervalTimeSec(): number {
    return this.it ?? DEFAULT_INTERVAL_TIMES;
  }

  /** Don't use this. */
  _setTotalTime(seconds: number): this {
    this.tt = seconds;
    return this;
  }

  /** Don't use this. */
  _getTotalTimeSec(): number {
    return this.tt ?? DEFAULT_TOTAL_TIME;
  }

  getResponse(): Response | undefined {
    return this.r;
  }

  setResponse(response: Response): this {
    this.r = response;
    return this;
  }

  /** This response should not have more than one AmountOfActivations. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setAmountOfActivations(amount: number | Range): this {
    error("TriggerOverTimeResponse: Cannot set amount of activations.");
  }

  override getVerb(participle: boolean): string {
    if (participle) {
      return "triggering";
    }
    const intervalTime = this.getIntervalTimeSec();
    const totalTime = this._getTotalTimeSec();
    return ` every ${intervalTime} ${addTheS(
      "second",
      intervalTime,
    )} for ${totalTime} ${addTheS("second", totalTime)}, `;
  }

  override getNoun(): string {
    error("TriggerOverTimeResponse.getNoun() should not be called");
  }

  getTriggeringResponseText(eid: boolean, participle: boolean): string {
    return (
      this.getResponse()?.getText(eid, participle) ??
      (participle ? EMPTY_RESPONSE_TEXT_PARTICIPLE : EMPTY_RESPONSE_TEXT)
    );
  }

  getText(eid: boolean, participle: boolean): string {
    const chanceToActivate = this.getChanceToActivateText(participle);
    return ` ${chanceToActivate} ${this.getVerb(
      participle,
    )} ${this.getTriggeringResponseText(eid, participle)}`;
  }

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
        if (this.tick()) {
          response.trigger(triggerData);
          this.trigger(triggerData);
        } else {
          this.ct = this.tt;
        }
      }, GAME_FRAMES_PER_SECOND * this.getIntervalTimeSec());
    }
  }
}
