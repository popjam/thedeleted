import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { Conditional } from "../../../enums/general/Conditional";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { isConditionalSatisfied } from "../../../maps/conditionalToFunctionMap";
import { conditionalToString } from "../../../maps/data/name/conditionToNameMap";
import { Response } from "./Response";

/**
 * If a condition is met, trigger the Response. If it is not met, trigger another Response.
 *
 * @example 'If you have 3 or more hearts, spawn 3 spiders, otherwise spawn a trinket'.
 *
 * @field con The conditions to check.
 * @field r The Response to trigger if the conditions are met.
 * @field or The Response to trigger if the conditions are not met.
 */
export class IfThenElseResponse extends Response {
  override responseType = ResponseType.IF_THEN_ELSE_TRIGGER;
  con?: Array<[Conditional, number]>;
  r?: Response;
  or?: Response;

  construct(
    conditionsMetResponse: Response,
    conditionsNotMetResponse: Response,
    // eslint-disable-next-line isaacscript/prefer-readonly-parameter-types
    ...conditions: Array<[Conditional, number]>
  ): this {
    this.con = conditions;
    this.or = conditionsNotMetResponse;
    this.r = conditionsMetResponse;
    return this;
  }

  getConditions(): Array<[Conditional, number]> | undefined {
    return this.con;
  }

  setConditions(
    // eslint-disable-next-line isaacscript/prefer-readonly-parameter-types
    ...conditions: Array<[Conditional, number]>
  ): this {
    this.con = conditions;
    return this;
  }

  /**
   * Add a condition. The number corresponds to the number parameter specific to the condition, will
   * default to 1 if not specified. Not all conditions require a number parameter.
   */
  addCondition(condition: Conditional, number?: number): this {
    if (this.con === undefined) {
      this.con = [];
    }

    this.con.push([condition, number ?? 1]);
    return this;
  }

  /** The response to trigger if the conditions are met. */
  getConditionsMetResponse(): Response | undefined {
    return this.r;
  }

  /** The response to trigger if the conditions are met. */
  setConditionsMetResponse(response: Response): this {
    this.r = response;
    return this;
  }

  /** The response to trigger if the conditions are not met. */
  getConditionsNotMetResponse(): Response | undefined {
    return this.or;
  }

  /** The response to trigger if the conditions are not met. */
  setConditionsNotMetResponse(response: Response): this {
    this.or = response;
    return this;
  }

  /** Must pass all conditions to return true. */
  checkConditions(player: EntityPlayer): boolean {
    const conditions = this.getConditions();
    if (conditions === undefined) {
      return true;
    }

    const hasFailedAtLeastOne = conditions.some(
      (condition) =>
        !isConditionalSatisfied(condition[0], player, condition[1]),
    );

    return !hasFailedAtLeastOne;
  }

  getConditionsText(): string {
    const conditions = this.getConditions();
    let text = "";
    if (conditions === undefined) {
      return text;
    }

    for (let i = 0; i < conditions.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const condition = conditions[i]!;
      text += conditionalToString(condition[0], condition[1]);
      if (i !== conditions.length - 1) {
        text += " and ";
      }
    }

    return text;
  }

  getConditionsMetResponseText(eid: boolean, participle: boolean): string {
    const response = this.getConditionsMetResponse();
    if (response === undefined) {
      error("IfThenElseResponse: Conditions met response is undefined.");
    }

    return response.getText(eid, participle);
  }

  getConditionsNotMetResponseText(eid: boolean, participle: boolean): string {
    const response = this.getConditionsNotMetResponse();
    if (response === undefined) {
      error("IfThenElseResponse: Conditions not met response is undefined.");
    }

    return response.getText(eid, participle);
  }

  override getVerb(_participle: boolean): string {
    error("IfThenElseResponse: No Verb required.");
  }

  override getNoun(_eid: boolean): string {
    error("IfThenElseResponse: No Noun required.");
  }

  override getText(eid: boolean, participle: boolean): string {
    if (participle) {
      return `${this.getConditionsMetResponseText(
        eid,
        participle,
      )} ${this.getConditionsText()}, otherwise ${this.getConditionsNotMetResponseText(
        eid,
        participle,
      )}`;
    }

    return `${this.getConditionsText()}, ${this.getConditionsMetResponseText(
      eid,
      participle,
    )}, otherwise ${this.getConditionsNotMetResponseText(eid, participle)}`;
  }

  override trigger(triggerData?: TriggerData): unknown[] {
    return super.trigger(triggerData);
  }

  override fire(triggerData: TriggerData): unknown {
    const player = triggerData.player ?? Isaac.GetPlayer(0);
    const response = this.getConditionsMetResponse();
    if (response === undefined) {
      error("IfThenElseResponse: Conditions met response is undefined.");
    }

    if (this.checkConditions(player)) {
      return response.trigger(triggerData);
    }
    const orResponse = this.getConditionsNotMetResponse();
    if (orResponse === undefined) {
      error("IfThenElseResponse: Conditions not met response is undefined.");
    }

    return orResponse.trigger(triggerData);
  }
}
