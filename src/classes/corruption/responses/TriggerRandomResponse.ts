import type { CollectibleType } from "isaac-typescript-definitions";
import type { WeightedArray } from "isaacscript-common";
import { getRandomFromWeightedArray, isArray } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getMostFrequentElementInArray } from "../../../helper/arrayHelper";
import { numberToWords } from "../../../helper/numbers/numberToWords";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
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

  override getMorality(): Morality {
    return (
      this.mo ??
      getMostFrequentElementInArray(this.r.map((r) => r[0].getMorality())) ??
      Morality.NEUTRAL
    );
  }

  addResponses(
    ...responseOrWeightedArrayTuple: Response[] | Array<[Response, number]>
  ): this {
    for (const responseData of responseOrWeightedArrayTuple) {
      this.addResponse(responseData);
    }
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

  override getText(eid = true): string {
    let text = "";
    let iterations = this.r.length;
    const amountOfActivations = this.getAmountOfActivations();
    if (amountOfActivations !== 1) {
      text +=
        typeof amountOfActivations === "number"
          ? ` ${numberToWords(amountOfActivations)}`
          : ` ${rangeToString(amountOfActivations)}`;
      text += " times, ";
    }
    for (const responseData of this.r) {
      const [response, weight] = responseData;
      text +=
        amountOfActivations === 1
          ? response.getText(eid)
          : response.getText(eid);
      // eslint-disable-next-line isaacscript/prefer-postfix-plusplus
      if (--iterations !== 0) {
        text += BETWEEN_RESPONSES_TEXT;
      }
    }
    return text;
  }

  fire(triggerData: TriggerData): void {
    getRandomFromWeightedArray(this.r, undefined).trigger(triggerData);
  }
}
