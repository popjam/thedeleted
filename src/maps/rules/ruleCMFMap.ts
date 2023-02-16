import { CustomModFeatures } from "../../constants/mod/featureConstants";
import { Rule } from "../../enums/customModFeatures/rules";
import { CustomModFeature } from "../../modFeatures/CustomModFeature";
import { CMFInstance } from "../../types/CMFInstance";

const RULE_CMF_MAP: ReadonlyMap<Rule, CustomModFeature<CMFInstance>> = new Map([
  [
    Rule.EVERY_ITEM_IS_RULE,
    CustomModFeatures.EveryItemIsFeature as CustomModFeature<CMFInstance>,
  ],
  [
    Rule.TOO_MANY_ITEMS_RULE,
    CustomModFeatures.TooManyItemsFeature as CustomModFeature<CMFInstance>,
  ],
]);

/** Get the Custom Mod Feature from its Rule. */
export function getCMFFromRule<T extends CMFInstance>(
  rule: Rule,
): CustomModFeature<T> {
  const CMF = RULE_CMF_MAP.get(rule);
  if (CMF !== undefined) {
    return CMF as CustomModFeature<T>;
  }
  error("ruleCMFMap: Custom Mod Feature not found from Rule!");
}
