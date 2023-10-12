import { getRandomInt, isColor } from "isaacscript-common";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { HAPPY99InvertedItemSpriteColor } from "../../../constants/modes/HAPPY99Constants";
import { EIDColorTriplet } from "../../../enums/compatibility/EIDColorTriplet";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import {
  defaultInvertedActiveActionSetBuilder,
  defaultInvertedPassiveActionSetBuilder,
  generateDefaultCorruptedCollectibleSprite,
} from "../genericBuilders";
import { fprint } from "../../printHelper";
import { rollPercentage } from "../../../types/general/Percentage";
import { DEFAULT_INVERTED_ACTIVE_GENERATION_PERCENTAGE } from "../../../constants/corruptionConstants";

export function happy99DefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  fprint("HAPPY99 DEFAULT BUILDER");
  const active =
    inputs?.forceActiveOrPassive ??
    rollPercentage(DEFAULT_INVERTED_ACTIVE_GENERATION_PERCENTAGE);

  /** Generate the ActionSet using default properties. */
  const actionSet = active
    ? defaultInvertedActiveActionSetBuilder(inputs)
    : defaultInvertedPassiveActionSetBuilder(inputs);

  /** Set the name and description. */
  actionSet
    .setName(`HAPPY99 ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("HAPPY99 DESCRIPTION");

  /** Set the icon. */
  const sprite = generateDefaultCorruptedCollectibleSprite(actionSet, inputs);
  if (!isColor(sprite)) {
    sprite.color = HAPPY99InvertedItemSpriteColor;
  }
  actionSet.setIcon(sprite);

  /** Set the text color. */
  actionSet.setTheme(EIDColorTriplet.HAPPY99_TRIPLET);

  return actionSet;
}
