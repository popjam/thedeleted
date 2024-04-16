import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { HAPPY99InvertedItemSpriteColor } from "../../../constants/modes/HAPPY99Constants";
import { EIDColorTriplet } from "../../../enums/compatibility/EID/EIDColorTriplet";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import {
  generateDefaultInvertedItemActionSet,
  generateDefaultCorruptedCollectibleSprite,
} from "../genericActionSetBuilders";
import { fprint } from "../../printHelper";

export function happy99DefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  fprint("Generating a new HAPPY99 Item...");
  const actionSet = generateDefaultInvertedItemActionSet(inputs);

  /** Set the name and description. */
  actionSet.setName("HAPPY99 ITEM").setDescription("HAPPY99 DESCRIPTION");

  /** Set the icon. */
  const sprite = generateDefaultCorruptedCollectibleSprite(actionSet, inputs);
  sprite.color = HAPPY99InvertedItemSpriteColor;
  actionSet.setIcon(sprite);

  /** Set the text color. */
  actionSet.setTheme(EIDColorTriplet.HAPPY99_TRIPLET);

  /** Set negatives carry over (unique to HAPPY99). */
  actionSet.setNegativesCarryOver(true);

  return actionSet;
}
