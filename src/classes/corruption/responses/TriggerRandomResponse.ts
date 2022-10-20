import { getRandomFromWeightedArray, WeightedArray } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { Response } from "./Response";

const DEFAULT_WEIGHT = 1;
const BETWEEN_RESPONSES_TEXT = " OR ";

/**
 * Response which contains a WeightedArray of sub-responses. Upon triggering, will trigger a random
 * response in that sub-array, taking into account its weight.
 */
export class TriggerRandomResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_RANDOM;
  override morality: Morality = Morality.NEUTRAL;
  responses: WeightedArray<Response> = [];

  addResponse(response: Response, weight = DEFAULT_WEIGHT): this {
    this.responses.push([response, weight]);
    return this;
  }

  override getText(): string {
    let text = "";
    let iterations = this.responses.length;
    const amountOfActivationsText = this.getAmountOfActivationsText();
    for (const responseData of this.responses) {
      const [response, weight] = responseData;
      text += response.getText();
      // eslint-disable-next-line isaacscript/prefer-postfix-plusplus
      if (--iterations !== 0) {
        text += BETWEEN_RESPONSES_TEXT;
      }
    }
    if (amountOfActivationsText !== "") {
      text = `repeat x${amountOfActivationsText} => (${text})`;
    }
    return text;
  }

  fire(player: EntityPlayer): void {
    getRandomFromWeightedArray(this.responses).trigger(player);
  }
}
