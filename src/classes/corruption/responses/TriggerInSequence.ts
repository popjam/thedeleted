import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getMostFrequentElementInArray } from "../../../helper/arrayHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";

const UNKNOWN_MORALITY_MORALITY = Morality.NEUTRAL;
const BETWEEN_RESPONSES_TEXT = " then ";

export class TriggerInSequenceResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_IN_SEQUENCE;
  r: Response[] = [];

  construct(...responses: Response[]): this {
    this.addResponse(...responses);
    return this;
  }

  /** Add Responses to the end of the Trigger Sequence. */
  addResponse(...responses: Response[]): this {
    this.r = this.r.concat(responses);
    return this;
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

  getText(): string {
    let text = "";
    let iterations = this.r.length;
    for (const response of this.r) {
      text += ` ${response.getText()} `;
      // eslint-disable-next-line isaacscript/prefer-postfix-plusplus
      if (--iterations !== 0) {
        text += BETWEEN_RESPONSES_TEXT;
      }
    }
    return text;
  }

  fire(triggerData: TriggerData): void {
    this.r.forEach((response) => {
      response.trigger(triggerData);
    });
  }
}
