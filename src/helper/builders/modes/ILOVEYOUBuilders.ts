import { getRandomInt, isColor } from "isaacscript-common";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { ILOVEYOUInvertedItemSpriteColor } from "../../../constants/modes/ILOVEYOUConstants";
import { EIDColorTriplet } from "../../../enums/compatibility/EIDColorTriplet";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import {
  defaultInvertedActiveActionSetBuilder,
  defaultInvertedPassiveActionSetBuilder,
  generateDefaultCorruptedCollectibleSprite,
} from "../genericBuilders";
import { getRandomInteger } from "../../randomHelper";

export function iLoveYouDefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const active = getRandomInteger(0, 1) === 0;
  let actionSet: InvertedItemActionSet | undefined;

  /** Generate the ActionSet using default properties. */
  actionSet = active
    ? defaultInvertedActiveActionSetBuilder(inputs)
    : defaultInvertedPassiveActionSetBuilder(inputs);

  /** Set the name and description. */
  actionSet
    .setName(`ILOVEYOU ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("ILOVEYOU DESCRIPTION");

  /** Set the icon. */
  const sprite = generateDefaultCorruptedCollectibleSprite(actionSet, inputs);
  if (!isColor(sprite)) {
    sprite.color = ILOVEYOUInvertedItemSpriteColor;
  }
  actionSet.setIcon(sprite);

  /** Set the text color. */
  actionSet.setTheme(EIDColorTriplet.ILOVEYOU_TRIPLET);

  return actionSet;
}
