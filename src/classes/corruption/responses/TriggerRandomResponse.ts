import {
  getRandomFromWeightedArray,
  isArray,
  WeightedArray,
} from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { multiplyRangesOrNumbers, Range } from "../../../types/general/Range";
import { Response } from "./Response";

const DEFAULT_WEIGHT = 1;
const BETWEEN_RESPONSES_TEXT = " or ";

/**
 * Response which contains a WeightedArray of sub-responses. Upon triggering, will trigger a random
 * response in that sub-array, taking into account its weight.
 */
export class TriggerRandomResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_RANDOM;
  override morality: Morality = Morality.NEUTRAL;
  responses: WeightedArray<Response> = [];

  construct(
    ...responseOrWeightedArrayTuple: Response[] | Array<[Response, number]>
  ): this {
    return this.addResponses(...responseOrWeightedArrayTuple);
  }

  addResponses(
    ...responseOrWeightedArrayTuple: Response[] | Array<[Response, number]>
  ): this {
    responseOrWeightedArrayTuple.forEach((responseData) => {
      this.addResponse(responseData);
    });
    return this;
  }

  addResponse(
    responseOrWeightedArrayTuple: Response | [Response, number],
  ): this {
    if (isArray(responseOrWeightedArrayTuple)) {
      this.responses.push(responseOrWeightedArrayTuple);
    } else {
      this.responses.push([responseOrWeightedArrayTuple, DEFAULT_WEIGHT]);
    }
    return this;
  }

  override getText(overrideAmountOfActivations?: number | Range): string {
    let text = "";
    let iterations = this.responses.length;
    const amountOfActivations =
      overrideAmountOfActivations ?? this.getAmountOfActivations();
    for (const responseData of this.responses) {
      const [response, weight] = responseData;
      if (amountOfActivations !== 1) {
        const responseAmountOfActivations = response.getAmountOfActivations();
        text += response.getText(
          multiplyRangesOrNumbers(
            amountOfActivations,
            responseAmountOfActivations,
          ),
        );
      } else {
        text += response.getText();
      }
      // eslint-disable-next-line isaacscript/prefer-postfix-plusplus
      if (--iterations !== 0) {
        text += BETWEEN_RESPONSES_TEXT;
      }
    }
    return text;
  }

  fire(player: EntityPlayer): void {
    getRandomFromWeightedArray(this.responses).trigger(player);
  }
}
