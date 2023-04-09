import { getRandomInt, isColor } from "isaacscript-common";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { HAPPY99_ACTION_SET_COLOR_TRIPLET } from "../../../constants/modes/HAPPY99Constants";
import { DeletedColor } from "../../../enums/general/DeletedColor";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import {
  defaultInvertedActiveActionSetBuilder,
  defaultInvertedPassiveActionSetBuilder,
  generateDefaultCorruptedCollectibleSprite,
} from "../genericBuilders";

export function happy99DefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const active = inputs?.forceActiveOrPassive ?? getRandomInt(0, 1) === 0;
  let actionSet: InvertedItemActionSet | undefined;

  /** Generate the ActionSet using default properties. */
  if (active) {
    actionSet = defaultInvertedActiveActionSetBuilder(inputs);
  } else {
    actionSet = defaultInvertedPassiveActionSetBuilder(inputs);
  }

  /** Set the name and description. */
  actionSet
    .setName(`HAPPY99 ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("HAPPY99 DESCRIPTION");

  /** Set the icon. */
  const sprite = generateDefaultCorruptedCollectibleSprite(actionSet, inputs);
  if (!isColor(sprite)) {
    sprite.color = DeletedColor.HAPPY_YELLOW;
  }
  actionSet.setIcon(sprite);

  /** Set the text color. */
  actionSet.setTheme(HAPPY99_ACTION_SET_COLOR_TRIPLET);

  return actionSet;
}
