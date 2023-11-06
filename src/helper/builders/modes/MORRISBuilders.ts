import { getRandomInt, isColor } from "isaacscript-common";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { MORRISInvertedItemSpriteColor } from "../../../constants/modes/MORRISConstants";
import { EIDColorTriplet } from "../../../enums/compatibility/EIDColorTriplet";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import {
  defaultInvertedActiveActionSetBuilder,
  defaultInvertedPassiveActionSetBuilder,
  generateDefaultCorruptedCollectibleSprite,
} from "../genericBuilders";
import { getRandomInteger } from "../../randomHelper";

export function morrisDefaultBuilder(
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
    .setName(`MORRIS ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("MORRIS DESCRIPTION");

  /** Set the icon. */
  const sprite = generateDefaultCorruptedCollectibleSprite(actionSet, inputs);
  if (!isColor(sprite)) {
    sprite.color = MORRISInvertedItemSpriteColor;
  }
  actionSet.setIcon(sprite);

  /** Set the text color. */
  actionSet.setTheme(EIDColorTriplet.MORRIS_TRIPLET);

  return actionSet;
}
