import { CollectibleType } from "isaac-typescript-definitions";
import {
  getRandomFromWeightedArray,
  isArray,
  WeightedArray,
} from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { numberToWords } from "../../../helper/numbers/numberToWords";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { rangeToString } from "../../../types/general/Range";
import { Response } from "./Response";

const DEFAULT_WEIGHT = 1;
const BETWEEN_RESPONSES_TEXT = " or ";

/**
 * Response which contains a WeightedArray of sub-responses. Upon triggering, will trigger a random
 * response in that sub-array, taking into account its weight.
 */
export class TriggerRandomResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_RANDOM;
  override mo: Morality = Morality.NEUTRAL;
  r: WeightedArray<Response> = [];

  construct(
    ...responseOrWeightedArrayTuple: Response[] | Array<[Response, number]>
  ): this {
    return this.addResponses(...responseOrWeightedArrayTuple);
  }

  override getInvolvedCollectibles(): CollectibleType[] {
    const collectibles: CollectibleType[] = [];
    for (const responseData of this.r) {
      const [response] = responseData;
      collectibles.push(...response.getInvolvedCollectibles());
    }
    return collectibles;
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
      this.r.push(responseOrWeightedArrayTuple);
    } else {
      this.r.push([responseOrWeightedArrayTuple, DEFAULT_WEIGHT]);
    }
    return this;
  }

  override getText(): string {
    let text = "";
    let iterations = this.r.length;
    const amountOfActivations = this.getAmountOfActivations();
    if (amountOfActivations !== 1) {
      if (typeof amountOfActivations === "number") {
        text += ` ${numberToWords(amountOfActivations)}`;
      } else {
        text += ` ${rangeToString(amountOfActivations)}`;
      }
      text += " times, ";
    }
    for (const responseData of this.r) {
      const [response, weight] = responseData;
      if (amountOfActivations !== 1) {
        text += response.getText();
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

  fire(triggerData: TriggerData): void {
    getRandomFromWeightedArray(this.r).trigger(triggerData);
  }
}
