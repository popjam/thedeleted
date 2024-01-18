import type { CollectibleType } from "isaac-typescript-definitions";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getMostFrequentElementInArray } from "../../../helper/arrayHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";

const UNKNOWN_MORALITY_MORALITY = Morality.NEUTRAL;
const BETWEEN_RESPONSES_TEXT = ", then ";

/**
 * Trigger one Response after another.
 *
 * @example 'Spawn a bomb, then spawn a troll bomb.'
 *
 * @param r The Responses to trigger in sequence.
 */
export class TriggerInSequenceResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_IN_SEQUENCE;
  r: Response[] = [];

  // eslint-disable-next-line isaacscript/prefer-readonly-parameter-types
  construct(...responses: Response[]): this {
    this.addResponses(...responses);
    return this;
  }

  /** Add Responses to the end of the Trigger Sequence. */
  // eslint-disable-next-line isaacscript/prefer-readonly-parameter-types
  addResponses(...responses: Response[]): this {
    this.r = [...this.r, ...responses];
    return this;
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

  /** There are no verbs for this Response. */
  override getVerb(_participle: boolean): string {
    error("There are no verbs for TriggerInSequenceResponse.");
  }

  override getNoun(): string {
    error("There are no nouns for TriggerInSequenceResponse.");
  }

  getText(eid: boolean, participle: boolean): string {
    let text = "";
    let iterations = this.r.length;
    for (const response of this.r) {
      text += ` ${response.getText(eid, participle)} `;
      // eslint-disable-next-line isaacscript/prefer-postfix-plusplus
      if (--iterations !== 0) {
        text += BETWEEN_RESPONSES_TEXT;
      }
    }
    return text;
  }

  override shouldFlattenResults(): boolean {
    return true;
  }

  override trigger(triggerData?: TriggerData): unknown[] {
    return super.trigger(triggerData);
  }

  fire(triggerData: TriggerData): unknown[] {
    const results: unknown[] = [];

    for (const response of this.r) {
      results.push(response.trigger(triggerData));
    }

    return results;
  }
}
