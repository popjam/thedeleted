import { CustomModFeatures } from "../../constants/mod/featureConstants";
import { Rule } from "../../enums/customModFeatures/rules";
import { CustomModFeature } from "../../modFeatures/CustomModFeature";
import { CMFInstance } from "../../types/CMFInstance";

const RULE_CMF_MAP: ReadonlyMap<Rule, CustomModFeature<CMFInstance>> = new Map([
  [Rule.EVERY_ITEM_IS_RULE, CustomModFeatures.EveryItemIsFeature],
]);

/** Get the Custom Mod Feature from its Rule. */
export function getCMFFromRule(rule: Rule): CustomModFeature<CMFInstance> {
  const CMF = RULE_CMF_MAP.get(rule);
  if (CMF !== undefined) {
    return CMF;
  }
  error("ruleCMFMap: Custom Mod Feature not found from Rule!");
}
