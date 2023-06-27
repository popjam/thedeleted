import { CollectibleType } from "isaac-typescript-definitions";
import {
  COLORS,
  getRandomInt,
  getRandomSeed,
  isColor,
} from "isaacscript-common";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { EIDColorTriplet } from "../../../enums/compatibility/EIDColorTriplet";
import { getAdvancedInvertedItemIconSetting } from "../../../features/settings/GeneralSettings";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { CorruptedCollectibleSprite } from "../../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { getRandomCollectibleType } from "../../collectibleHelper";
import {
  defaultInvertedActiveActionSetBuilder,
  defaultInvertedPassiveActionSetBuilder,
} from "../genericBuilders";

export function mydoomDefaultBuilder(
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
  actionSet
    .setName(`MYDOOM ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("MYDOOM DESCRIPTION");

  /** Set the icon. */
  const sprite = generateMydoomCorruptedCollectibleSprite(actionSet, inputs);
  if (!isColor(sprite)) {
    sprite.flipX = getRandomInt(0, 1) === 0;
    sprite.flipY = getRandomInt(0, 1) === 0;
  }
  actionSet.setIcon(sprite);

  /** Set the text color. */
  actionSet.setTheme(EIDColorTriplet.MYDOOM_TRIPLET);

  return actionSet;
}

function generateMydoomCorruptedCollectibleSprite(
  actionSet: InvertedItemActionSet,
  inputs?: ActionSetBuilderInput,
): CorruptedCollectibleSprite | Color {
  const advancedIcons = getAdvancedInvertedItemIconSetting();
  if (!advancedIcons) {
    return COLORS.Black;
  }
  const sprite: CorruptedCollectibleSprite = {
    collectibles: [
      inputs?.collectible ?? getRandomCollectibleType() ?? CollectibleType.POOP,
    ],
    seed: getRandomSeed(),
    color: COLORS.Black,
  };
  const multipleSegments = getRandomInt(0, 1) === 0;
  if (!multipleSegments) {
    sprite.flipX = getRandomInt(0, 1) === 0;
    sprite.flipY = getRandomInt(0, 1) === 0;
  } else {
    sprite.flipX = undefined;
    sprite.flipY = undefined;

    const mirror = getRandomInt(0, 1) === 0;
    if (mirror) {
      sprite.collectibles.push(
        inputs?.collectible ??
          getRandomCollectibleType() ??
          CollectibleType.POOP,
      );
    }

    const confusion = getRandomInt(0, 1) === 0;
    if (confusion) {
      sprite.collectibles.push(
        getRandomCollectibleType() ?? CollectibleType.POOP,
      );
      // Randomize the order of the collectibles.
      sprite.collectibles.sort(() => Math.random() - 0.5);
    }
  }
  return sprite;
}
