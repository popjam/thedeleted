import { CollectibleType } from "isaac-typescript-definitions";
import { GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { addTheS } from "../../../helper/stringHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";
import { Range } from "../../../types/general/Range";
import { Response } from "./Response";

const DEFAULT_INTERVAL_TIMES = 1;
const DEFAULT_TOTAL_TIME = 60;
const NO_RESPONSE_MORALITY = Morality.NEUTRAL;

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
    this.ct = this.getTotalTimeSec();
    this.r = response;
    return this;
  }

  override getInvolvedCollectibles(): CollectibleType[] {
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
  setTotalTime(seconds: number): this {
    this.tt = seconds;
    return this;
  }

  /** Don't use this. */
  getTotalTimeSec(): number {
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
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  override setAmountOfActivations(amount: number | Range): this {
    throw new Error(
      "TriggerOverTimeResponse: Cannot set amount of activations.",
    );
  }

  getWaitText(): string {
    const intervalTime = this.getIntervalTimeSec();
    const totalTime = this.getTotalTimeSec();
    return ` every ${intervalTime} ${addTheS(
      "second",
      intervalTime,
    )} for ${totalTime} ${addTheS("second", totalTime)}, `;
  }

  getText(): string {
    let text = ` ${this.getWaitText()} `;
    text += this.getResponse()?.getText() ?? "do nothing.";
    return text;
  }

  override getMorality(): Morality {
    return this.mo ?? this.getResponse()?.getMorality() ?? NO_RESPONSE_MORALITY;
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
