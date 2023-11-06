import { CollectibleType } from "isaac-typescript-definitions";
import {
  COLORS,
  getRandomInt,
  getRandomSeed,
  isColor,
} from "isaacscript-common";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { EIDColorTriplet } from "../../../enums/compatibility/EIDColorTriplet";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import type { CorruptedCollectibleSprite } from "../../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { getRandomCollectibleType } from "../../collectibleHelper";
import {
  defaultInvertedActiveActionSetBuilder,
  defaultInvertedPassiveActionSetBuilder,
} from "../genericBuilders";
import { getRandomInteger } from "../../randomHelper";

export function mydoomDefaultBuilder(
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
    .setName(`MYDOOM ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("MYDOOM DESCRIPTION");

  /** Set the icon. */
  const sprite = generateMydoomCorruptedCollectibleSprite(actionSet, inputs);
  if (!isColor(sprite)) {
    sprite.flipX = getRandomInteger(0, 1) === 0;
    sprite.flipY = getRandomInteger(0, 1) === 0;
  }
  actionSet.setIcon(sprite);

  /** Set the text color. */
  actionSet.setTheme(EIDColorTriplet.MYDOOM_TRIPLET);

  return actionSet;
}

function generateMydoomCorruptedCollectibleSprite(
  actionSet: InvertedItemActionSet,
  inputs?: ActionSetBuilderInput,
): CorruptedCollectibleSprite {
  const sprite: CorruptedCollectibleSprite = {
    collectibles: [
      inputs?.collectible ?? getRandomCollectibleType() ?? CollectibleType.POOP,
    ],
    seed: getRandomSeed(),
    color: COLORS.Black,
  };
  const multipleSegments = getRandomInteger(0, 1) === 0;
  if (multipleSegments) {
    sprite.flipX = undefined;
    sprite.flipY = undefined;

    const mirror = getRandomInteger(0, 1) === 0;
    if (mirror) {
      sprite.collectibles.push(
        inputs?.collectible ??
          getRandomCollectibleType() ??
          CollectibleType.POOP,
      );
    }

    const confusion = getRandomInteger(0, 1) === 0;
    if (confusion) {
      sprite.collectibles.push(
        getRandomCollectibleType() ?? CollectibleType.POOP,
      );
      // Randomize the order of the collectibles.
      sprite.collectibles.sort(() => Math.random() - 0.5);
    }
  } else {
    sprite.flipX = getRandomInteger(0, 1) === 0;
    sprite.flipY = getRandomInteger(0, 1) === 0;
  }
  return sprite;
}
