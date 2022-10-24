import { GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getRunIndex } from "../../../features/runIndex";
import { addTheS } from "../../../helper/stringHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";
import { Range } from "../../../types/general/Range";
import { Response } from "./Response";

const DEFAULT_INTERVAL_TIMES = 1;
const DEFAULT_TOTAL_TIME = 60;
const NO_RESPONSE_MORALITY = Morality.NEUTRAL;

/**
 * Waits a set amount of seconds, and then triggers the Response contained inside it. Note: If there
 * is more than one amountOfActivations, will wait then trigger them all at once.
 *
 * To get the behavior of wait, do X, wait, do X, wait, do X, then use TriggerOverIntervalResponse.
 */
export class TriggerOverTimeResponse extends Response {
  override responseType: ResponseType = ResponseType.WAIT_THEN_TRIGGER;
  response?: Response;
  intervalTime = DEFAULT_INTERVAL_TIMES;
  totalTime = DEFAULT_TOTAL_TIME;
  currentTime = DEFAULT_TOTAL_TIME;
  runIndex?: number;

  construct(
    response: Response,
    amountOfTriggers?: number,
    intervalTime?: number,
  ): this {
    if (intervalTime !== undefined) {
      this.intervalTime = intervalTime;
    }
    // Amount of triggers x Interval between triggers = Total time.
    if (amountOfTriggers !== undefined) {
      this.totalTime = amountOfTriggers * this.intervalTime;
    }
    this.currentTime = this.totalTime;
    this.response = response;
    return this;
  }

  /** Ticks down the timer. If below or equal to 0, returns false. */
  tick(): boolean {
    this.currentTime -= this.intervalTime;
    return this.currentTime >= 0;
  }

  setIntervalTime(seconds: number): this {
    this.intervalTime = seconds;
    return this;
  }

  setTotalTime(seconds: number): this {
    this.totalTime = seconds;
    return this;
  }

  getResponse(): Response | undefined {
    return this.response;
  }

  setResponse(response: Response): this {
    this.response = response;
    return this;
  }

  getWaitText(): string {
    const { intervalTime } = this;
    const { totalTime } = this;
    return ` every ${intervalTime} ${addTheS(
      "second",
      intervalTime,
    )} for ${totalTime} ${addTheS("second", totalTime)}, `;
  }

  getText(overrideAmountOfActivations?: number | Range): string {
    const amountOfActivations =
      overrideAmountOfActivations ?? this.getAmountOfActivations();
    let text = ` ${this.getWaitText()} `;
    text += this.getResponse()?.getText(amountOfActivations) ?? "do nothing.";
    return text;
  }

  override getMorality(): Morality {
    return (
      this.morality ?? this.getResponse()?.getMorality() ?? NO_RESPONSE_MORALITY
    );
  }

  fire(triggerData: TriggerData): void {
    if (this.runIndex === undefined) {
      this.runIndex = getRunIndex();
    }

    const response = this.getResponse();
    if (response !== undefined) {
      mod.runInNGameFrames(() => {
        if (this.runIndex === getRunIndex()) {
          if (this.tick()) {
            response.trigger(triggerData);
            this.trigger(triggerData);
          } else {
            this.currentTime = this.totalTime;
          }
        }
      }, GAME_FRAMES_PER_SECOND * this.intervalTime);
    }
  }
}
