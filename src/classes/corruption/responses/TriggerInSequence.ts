import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getMostFrequentElementInArray } from "../../../helper/arrayHelper";
import { Range } from "../../../types/general/Range";
import { Response } from "./Response";

const DEFAULT_SECONDS_BETWEEN_TRIGGERS = 1;
const UNKNOWN_MORALITY_MORALITY = Morality.NEUTRAL;

export class TriggerInSequenceResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_IN_SEQUENCE;
  responses: Response[] = [];
  secondsBetweenTriggers = DEFAULT_SECONDS_BETWEEN_TRIGGERS;

  construct(msBetweenTriggers?: number, ...responses: Response[]): this {
    if (msBetweenTriggers !== undefined) {
      this.setSecondsBetweenTriggers(msBetweenTriggers);
    }
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
    return "";
  }

  setSecondsBetweenTriggers(msBetweenTriggers: number): this {
    if (msBetweenTriggers < 0) {
      msBetweenTriggers = DEFAULT_SECONDS_BETWEEN_TRIGGERS;
    }
    this.secondsBetweenTriggers = msBetweenTriggers;
    return this;
  }

  fire(entityPlayer: EntityPlayer): void {}
}
