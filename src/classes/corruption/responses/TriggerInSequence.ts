import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getMostFrequentElementInArray } from "../../../helper/arrayHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Range } from "../../../types/general/Range";
import { Response } from "./Response";

const UNKNOWN_MORALITY_MORALITY = Morality.NEUTRAL;
const BETWEEN_RESPONSES_TEXT = " then ";

export class TriggerInSequenceResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_IN_SEQUENCE;
  responses: Response[] = [];

  construct(...responses: Response[]): this {
    this.addResponse(...responses);
    return this;
  }

  /** Add Responses to the end of the Trigger Sequence. */
  addResponse(...responses: Response[]): this {
    this.responses = this.responses.concat(responses);
    return this;
  }

  /**
   * Morality should be the general Morality of Queued Responses, unless morality is already set.
   */
  override getMorality(): Morality {
    const { responses } = this;
    return (
      this.morality ??
      getMostFrequentElementInArray(
        this.responses.map((response) => response.getMorality()),
      ) ??
      UNKNOWN_MORALITY_MORALITY
    );
  }

  getText(overrideAmountOfActivations?: number | Range): string {
    let text = "";
    let iterations = this.responses.length;
    for (const response of this.responses) {
      text += ` ${response.getText(overrideAmountOfActivations)} `;
      // eslint-disable-next-line isaacscript/prefer-postfix-plusplus
      if (--iterations !== 0) {
        text += BETWEEN_RESPONSES_TEXT;
      }
    }
    return text;
  }

  fire(triggerData: TriggerData): void {
    this.responses.forEach((response) => {
      response.trigger(triggerData);
    });
  }
}
