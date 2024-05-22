import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { Conditional } from "../../../enums/general/Conditional";
import { fprint } from "../../../helper/printHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { isConditionalSatisfied } from "../../../maps/conditionalToFunctionMap";
import { conditionalToString } from "../../../maps/data/name/conditionToNameMap";
import { Response } from "./Response";

/**
 * If a condition is met, trigger the Response.
 *
 * @example 'If you have 3 or more hearts, spawn 3 spiders'.
 *
 * @field con The conditions to check.
 * @field r The Response to trigger if the conditions are met.
 */
export class IfThenResponse extends Response {
  override responseType = ResponseType.IF_THEN_TRIGGER;
  con?: Array<[Conditional, number]>;
  r?: Response;

  construct(
    response: Response,

    ...conditions: Array<[Conditional, number]>
  ): this {
    this.con = conditions;
    this.r = response;
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

  getResponse(): Response | undefined {
    return this.r;
  }

  setResponse(response: Response): this {
    this.r = response;
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

  getResponseText(eid: boolean, participle: boolean): string {
    const response = this.getResponse();
    if (response === undefined) {
      fprint("IfThenResponse: Response is undefined.");
      return "";
    }

    return response.getText(eid, participle);
  }

  override getVerb(participle: boolean): string {
    const response = this.getResponse();
    if (response === undefined) {
      fprint("IfThenResponse: Response is undefined.");
      return "";
    }

    return response.getVerb(participle);
  }

  override getNoun(eid: boolean): string {
    const response = this.getResponse();
    if (response === undefined) {
      fprint("IfThenResponse: Response is undefined.");
      return "";
    }

    return response.getNoun(eid);
  }

  override getText(eid: boolean, participle: boolean): string {
    if (participle) {
      return `${this.getChanceToActivateText(
        participle,
      )} ${this.getResponseText(eid, participle)} ${this.getConditionsText()}`;
    }

    return `${this.getChanceToActivateText(
      participle,
    )} ${this.getConditionsText()}, ${this.getResponseText(eid, participle)}`;
  }

  override trigger(triggerData?: TriggerData): unknown[] {
    return super.trigger(triggerData);
  }

  override fire(triggerData: TriggerData): unknown {
    const player = triggerData.player ?? Isaac.GetPlayer(0);
    const response = this.getResponse();
    if (response === undefined) {
      fprint("IfThenResponse: Response is undefined.");
      return undefined;
    }

    if (this.checkConditions(player)) {
      return response.trigger(triggerData);
    }

    return undefined;
  }
}
