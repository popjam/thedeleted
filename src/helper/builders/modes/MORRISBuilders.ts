import { getRandomInt, isColor } from "isaacscript-common";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { DeletedColor } from "../../../enums/general/DeletedColor";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import {
  defaultInvertedActiveActionSetBuilder,
  defaultInvertedPassiveActionSetBuilder,
  generateDefaultCorruptedCollectibleSprite,
} from "../genericBuilders";

export function morrisDefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const active = getRandomInt(0, 1) === 0;
  let actionSet: InvertedItemActionSet | undefined;

  /** Generate the ActionSet using default properties. */
  if (active) {
    actionSet = defaultInvertedActiveActionSetBuilder(inputs);
  } else {
    actionSet = defaultInvertedPassiveActionSetBuilder(inputs);
  }

  /** Set the name and description. */
  actionSet.setName("MORRIS").setDescription("MORRIS DESCRIPTION");

  /** Set the icon. */
  const sprite = generateDefaultCorruptedCollectibleSprite(actionSet, inputs);
  if (!isColor(sprite)) {
    sprite.color = DeletedColor.WORM_TURQUOISE;
  }
  actionSet.setIcon(sprite);

  return actionSet;
}
