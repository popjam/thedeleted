import type { CollectibleType } from "isaac-typescript-definitions";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import { getMostFrequentElementInArray } from "../../../helper/arrayHelper";
import { Morality } from "../../../enums/corruption/Morality";

const UNKNOWN_MORALITY_MORALITY = Morality.NEUTRAL;
const VERB = "alternate between";
const VERB_PARTICIPLE = "alternating between";
const BETWEEN_RESPONSES_TEXT = " and ";

/**
 * Response to trigger Responses in a queue, putting each Response at the end of the queue after it
 * is triggered.
 */
export class TriggerInQueueResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_IN_QUEUE;

  r: Response[] = [];

  // eslint-disable-next-line isaacscript/prefer-readonly-parameter-types
  override construct(...responses: Response[]): this {
    this.addResponses(...responses);
    return this;
  }

  /** Add Responses to the end of the Queue. */
  // eslint-disable-next-line isaacscript/prefer-readonly-parameter-types
  addResponses(...responses: Response[]): this {
    this.r = [...this.r, ...responses];
    return this;
  }

  /** Returns the first element of the array, and moves it to the end of the Queue. */
  shiftResponses(): Response | undefined {
    const response = this.r.shift();
    if (response) {
      this.r.push(response);
    }
    return response;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getNoun(): string {
    error("TriggerInQueueResponse.getNoun() should not be called");
  }

  override getInvolvedCollectibles(): CollectibleType[] {
    return this.r.flatMap((response) => response.getInvolvedCollectibles());
  }

  /**
   * Morality should be the general Morality of Queued Responses, unless morality is already set.
   */
  override getMorality(): Morality {
    return (
      this.mo ??
      getMostFrequentElementInArray(
        this.r.map((response) => response.getMorality()),
      ) ??
      UNKNOWN_MORALITY_MORALITY
    );
  }

  override getText(eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const responsesText = this.r
      .map((response) => response.getText(eid, true))
      .join(BETWEEN_RESPONSES_TEXT);
    return `${verb} ${responsesText}`;
  }

  override shouldFlattenResults(): boolean {
    return true;
  }

  override trigger(triggerData?: TriggerData): unknown[] {
    return super.trigger(triggerData);
  }

  override fire(triggerData: TriggerData): unknown {
    const response = this.shiftResponses();
    if (response) {
      return response.trigger(triggerData);
    }

    return undefined;
  }
}
