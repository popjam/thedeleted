import type { CollectibleType } from "isaac-typescript-definitions";
import type { WeightedArray } from "isaacscript-common";
import { getRandomFromWeightedArray, isArray } from "isaacscript-common";
import { Morality } from "../../../enums/corruption/Morality";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getMostFrequentElementInArray } from "../../../helper/arrayHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";

const DEFAULT_WEIGHT = 1;
const BETWEEN_RESPONSES_TEXT = " or ";

/**
 * Response which contains a WeightedArray of sub-responses. Upon triggering, will trigger a random
 * response in that sub-array, taking into account its weight. Default weight is 1.
 */
export class TriggerRandomResponse extends Response {
  override responseType: ResponseType = ResponseType.TRIGGER_RANDOM;
  r: WeightedArray<Response> = [];

  construct(
    // eslint-disable-next-line isaacscript/prefer-readonly-parameter-types
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
    // eslint-disable-next-line isaacscript/prefer-readonly-parameter-types
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

  getResponses(): readonly Response[] {
    return this.r.map((responseData) => responseData[0]);
  }

  /** This Response does not have a Verb. */
  override getVerb(_participle: boolean): string {
    error("TriggerRandomResponse: No verb.");
  }

  /** This Response does not have a Noun. */
  override getNoun(): string {
    error("TriggerRandomResponse: No noun.");
  }

  getResponsesText(eid: boolean, participle: boolean): string {
    const r = this.getResponses();
    let text = "";
    let iterations = r.length;
    const chanceToActivate = this.getChanceToActivateText(participle);
    for (const response of r) {
      text += response.getText(eid, participle);
      // eslint-disable-next-line isaacscript/prefer-postfix-plusplus
      if (--iterations !== 0) {
        text += BETWEEN_RESPONSES_TEXT;
      }
    }

    return `${chanceToActivate} ${text}`;
  }

  override getText(eid: boolean, participle: boolean): string {
    return `${this.getAmountOfActivationsText() ?? ""} ${this.getResponsesText(
      eid,
      participle,
    )}`;
  }

  override shouldFlattenResults(): boolean {
    return true;
  }

  override trigger(triggerData?: TriggerData): unknown[] {
    return super.trigger(triggerData);
  }

  fire(triggerData: TriggerData): unknown {
    return getRandomFromWeightedArray(this.r, undefined).trigger(triggerData);
  }
}
