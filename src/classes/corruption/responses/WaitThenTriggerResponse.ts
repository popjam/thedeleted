import type { CollectibleType } from "isaac-typescript-definitions";
import { GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";
import type { Range } from "../../../types/general/Range";
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
  r?: Response;
  sW?: number;

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
  setSecondsToWait(seconds: number): this {
    this.sW = seconds;
    return this;
  }

  /** The amount of seconds to wait before the Response triggers. */
  getSecondsToWait(): number {
    return this.sW ?? DEFAULT_WAIT_TIME_SECONDS;
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
    throw new Error(
      "TriggerOverTimeResponse: Cannot set amount of activations.",
    );
  }

  /** The amount of seconds to wait before the Response triggers. */
  getWaitText(): string {
    const secondsWait = this.getSecondsToWait();
    return `wait ${secondsWait} ${addTheS("second", secondsWait)}, then `;
  }

  getText(eid = true): string {
    let text = ` ${this.getWaitText()} `;
    text += this.getResponse()?.getText(eid) ?? "do nothing.";
    return text;
  }

  /**
   * Returns its set morality, if a morality is not set returns its responses morality, if there is
   * no response morality, returns a default morality.
   */
  override getMorality(): Morality {
    return this.mo ?? this.getResponse()?.getMorality() ?? NO_RESPONSE_MORALITY;
  }

  fire(triggerData: TriggerData): void {
    const response = this.getResponse();
    if (response !== undefined) {
      mod.runInNGameFrames(() => {
        response.trigger(triggerData);
      }, GAME_FRAMES_PER_SECOND * this.getSecondsToWait());
    }
  }
}
