import { GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getRunIndex } from "../../../features/runIndex";
import { addTheS } from "../../../helper/stringHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";
import { Range } from "../../../types/general/Range";
import { Response } from "./Response";

const DEFAULT_WAIT_TIME_SECONDS = 1;
const NO_RESPONSE_MORALITY = Morality.NEUTRAL;

/**
 * Waits a set amount of seconds, and then triggers the Response contained inside it. Note: If there
 * is more than one amountOfActivations, will wait then trigger them all at once.
 *
 * To get the behavior of wait, do X, wait, do X, wait, do X, then use TriggerOverIntervalResponse.
 */
export class WaitThenTriggerResponse extends Response {
  override responseType: ResponseType = ResponseType.WAIT_THEN_TRIGGER;
  response?: Response;
  secondsWait = DEFAULT_WAIT_TIME_SECONDS;
  runIndex?: number;

  construct(response: Response, secondsWait?: number): this {
    if (secondsWait !== undefined) {
      this.secondsWait = secondsWait;
    }
    this.response = response;
    return this;
  }

  setSecondsToWait(seconds: number): this {
    this.secondsWait = seconds;
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
    const { secondsWait } = this;
    return `wait ${secondsWait} ${addTheS("second", secondsWait)}, then `;
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
          response.trigger(triggerData);
        }
      }, GAME_FRAMES_PER_SECOND * this.secondsWait);
    }
  }
}
