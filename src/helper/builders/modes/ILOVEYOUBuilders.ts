import { getRandomFromWeightedArray, isColor } from "isaacscript-common";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import {
  ILOVEYOUInvertedItemSpriteColor,
  ILOVEYOU_NUMBER_OF_EFFECTS,
} from "../../../constants/modes/ILOVEYOUConstants";
import { EIDColorTriplet } from "../../../enums/compatibility/EID/EIDColorTriplet";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import {
  generateDefaultInvertedItemActionSet,
  generateDefaultCorruptedCollectibleSprite,
} from "../genericActionSetBuilders";

export function iLoveYouDefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  inputs ??= {};
  inputs.numberOfEffects = getRandomFromWeightedArray(
    ILOVEYOU_NUMBER_OF_EFFECTS,
    undefined,
  );

  const actionSet = generateDefaultInvertedItemActionSet(inputs);

  /** Set the name and description. */
  actionSet.setName("ILOVEYOU ITEM").setDescription("ILOVEYOU DESCRIPTION");

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
