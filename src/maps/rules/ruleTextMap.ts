import { getCollectibleName } from "isaacscript-common";
import { Rule } from "../../enums/customModFeatures/rules";
import { EveryItemIsInstance } from "../../modFeatures/general/EveryItemIsFeature";
import { TooManyItemsInstance } from "../../modFeatures/general/TooManyItemsFeature";
import { CMFInstance } from "../../types/CMFInstance";

const RULE_TEXT_MAP: ReadonlyMap<Rule, (instance: CMFInstance) => string> =
  new Map([
    [
      Rule.EVERY_ITEM_IS_RULE,
      (instance: CMFInstance) =>
        `every item is ${getCollectibleName(
          (instance as EveryItemIsInstance).collectibleType,
        )}`,
    ],
    [
      Rule.TOO_MANY_ITEMS_RULE,
      (instance: CMFInstance) =>
        ` any items over a limit of ${
          (instance as TooManyItemsInstance).limit
        } will be removed`,
    ],
  ]);

/** Get the text from the Rule and its Custom Mod Feature Instance. */
export function getRuleText<T extends CMFInstance>(
  rule: Rule,
  instance: T,
): string {
  const TextMethod = RULE_TEXT_MAP.get(rule);
  if (TextMethod !== undefined) {
    return TextMethod(instance);
  }
  error("ruleCMFMap: Custom Mod Feature not found from Rule!");
}
