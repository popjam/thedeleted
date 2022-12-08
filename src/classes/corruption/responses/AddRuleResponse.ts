import { CollectibleType } from "isaac-typescript-definitions";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { Rule } from "../../../enums/customModFeatures/rules";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { getCMFFromRule } from "../../../maps/rules/ruleCMFMap";
import { getRuleText } from "../../../maps/rules/ruleTextMap";
import { EveryItemIsInstance } from "../../../modFeatures/general/EveryItemIsFeature";
import { CMFInstance, RulePlusInstance } from "../../../types/CMFInstance";
import { Response } from "./Response";

const DEFAULT_RPI: RulePlusInstance = [
  Rule.EVERY_ITEM_IS_RULE,
  { collectibleType: CollectibleType.ABEL } as EveryItemIsInstance,
];

/**
 * Activates a 'Rule' which modifies the game in certain ways. Must provide a 'CMFInstance'
 * associated with that rule.
 */
export class AddRuleResponse extends Response {
  override responseType: ResponseType = ResponseType.ADD_RULE;
  rpi?: RulePlusInstance;
  id?: number;

  construct<T extends CMFInstance>(rule: Rule, instance: T): this {
    this.rpi = [rule, { ...instance }];
    return this;
  }

  /** Returns the Rule and the blueprint CMFInstance associated with it. */
  getRulePlusInstance(): RulePlusInstance {
    return this.rpi ?? DEFAULT_RPI;
  }

  /** Set the Rule and the blueprint CMFInstance associated with it. */
  setRulePlusInstance<T extends CMFInstance>(rule: Rule, instance: T): this {
    this.rpi = [rule, { ...instance }];
    return this;
  }

  /** Get the ID associated with the Rule instance. If the rule is not activated, returns 0. */
  getID(): number {
    return this.id ?? 0;
  }

  /** Set the ID associated with the Rule instance. */
  setID(id: number): this {
    this.id = id;
    return this;
  }

  getText(): string {
    const rpi = this.getRulePlusInstance();
    return getRuleText(rpi[0], rpi[1]);
  }

  fire(triggerData: TriggerData): void {
    const player = triggerData.player ?? Isaac.GetPlayer();

    const rpi = this.getRulePlusInstance();
    const cmf = getCMFFromRule(rpi[0]);
    const id = cmf.subscribeWithInstance({ ...rpi[1] });
    this.setID(id);
  }
}
