import { getCollectibleName } from "isaacscript-common";
import { Rule } from "../../enums/customModFeatures/rules";
import { EveryItemIsInput } from "../../modFeatures/general/EveryItemIsFeature";
import { TooManyItemsInput } from "../../modFeatures/general/TooManyItemsFeature";
import { CMFInputs } from "../../types/CMFInstance";

const RULE_TEXT_MAP: ReadonlyMap<Rule, (instance: CMFInputs) => string> =
  new Map([
    [
      Rule.EVERY_ITEM_IS_RULE,
      (instance: CMFInputs) =>
        `every item is ${getCollectibleName(
          (instance as EveryItemIsInput).collectibleType,
        )}`,
    ],
    [
      Rule.TOO_MANY_ITEMS_RULE,
      (instance: CMFInputs) =>
        ` any items over a limit of ${
          (instance as TooManyItemsInput).limit
        } will be removed`,
    ],
  ]);

/** Get the text from the Rule and its Custom Mod Feature Instance. */
export function getRuleText<T extends CMFInputs>(rule: Rule, input: T): string {
  const TextMethod = RULE_TEXT_MAP.get(rule);
  if (TextMethod !== undefined) {
    return TextMethod(input);
  }
  error("ruleCMFMap: Custom Mod Feature not found from Rule!");
}
