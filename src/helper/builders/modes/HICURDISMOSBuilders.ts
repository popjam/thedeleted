import { colorEquals, getRandomInt, isColor } from "isaacscript-common";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { EIDColorTriplet } from "../../../enums/compatibility/EIDColorTriplet";
import { DeletedColor } from "../../../enums/general/DeletedColor";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import {
  defaultInvertedActiveActionSetBuilder,
  defaultInvertedPassiveActionSetBuilder,
  generateDefaultCorruptedCollectibleSprite,
} from "../genericBuilders";

const SPRITE_COLOR_1 = DeletedColor.WINDOWS_BLUE;
const SPRITE_COLOR_2 = DeletedColor.WINDOWS_WHITE;

export function hicurdismosDefaultBuilder(
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
    .setName(`HICURDISMOS ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("HICURDISMOS DESCRIPTION");

  /** Set the icon. */
  const sprite = generateDefaultCorruptedCollectibleSprite(actionSet, inputs);
  if (!isColor(sprite)) {
    const color1 = getRandomInt(0, 1) === 0 ? SPRITE_COLOR_1 : SPRITE_COLOR_2;
    const color2 = colorEquals(color1, SPRITE_COLOR_2)
      ? SPRITE_COLOR_2
      : SPRITE_COLOR_1;
    sprite.color = [color1, color2];
  }
  actionSet.setIcon(sprite);

  /** Set the text color. */
  actionSet.setTheme(EIDColorTriplet.HICURDISMOS_TRIPLET);

  return actionSet;
}
