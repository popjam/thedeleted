import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { Rule } from "../../../enums/customModFeatures/rules";
import { fprint } from "../../../helper/printHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { getCMFFromRule } from "../../../maps/rules/ruleCMFMap";
import { Response } from "./Response";

export class RemoveRuleResponse extends Response {
  override responseType: ResponseType = ResponseType.REMOVE_RULE;
  r?: Rule;
  id?: number;

  getRule(): Rule | undefined {
    return this.r;
  }

  setRule(rule: Rule): this {
    this.r = rule;
    return this;
  }

  getID(): number | undefined {
    return this.id;
  }

  setID(id: number): this {
    this.id = id;
    return this;
  }

  getText(): string {
    return "";
  }

  fire(triggerData: TriggerData): void {
    fprint("firing RemoveRuleResponse.");
    const player = triggerData.player ?? Isaac.GetPlayer();
    const rule = this.getRule();
    const instance = this.getID();

    if (rule === undefined || instance === undefined) {
      return;
    }

    const CMF = getCMFFromRule(rule);
    fprint("unsubscribing...");
    CMF.unsubscribe(instance);
  }
}
