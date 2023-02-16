import { CollectibleType } from "isaac-typescript-definitions";
import {
  clamp,
  getRandomColor,
  getRandomSeed,
  isColor,
  newCollectibleSprite,
} from "isaacscript-common";
import { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { randomInRange, Range } from "../../types/general/Range";
import {
  getCollectibleRenderOffset,
  getRandomCollectibleType,
} from "../collectibleHelper";
import { worldToRenderPosition } from "../renderHelper";

const DEFAULT_CUSTOM_COLLECTIBLE_SPRITE_COLLECTIBLES = [1, 4] as const;

/** This function generates a default random CorruptedCollectibleSprite object. */
export function generateCorruptedCollectibleSprite(): CorruptedCollectibleSprite {
  const collectibles: CollectibleType[] = [];
  const numCollectibles = randomInRange(
    DEFAULT_CUSTOM_COLLECTIBLE_SPRITE_COLLECTIBLES as Range,
  );
  for (let i = 0; i < numCollectibles; i++) {
    collectibles.push(getRandomCollectibleType() ?? CollectibleType.POOP);
  }
  return {
    seed: getRandomSeed(),
    collectibles,
  };
}

/**
 * Renders a Custom Collectible Sprite (TMTRAINER like sprite) over a collectible, accounting for
 * any offsets.
 */
export function renderCustomCollectibleSpriteOverCollectible(
  collectible: EntityPickupCollectible,
  customSprite: CorruptedCollectibleSprite,
  scale?: Vector,
): void {
  const position = worldToRenderPosition(
    collectible.Position.add(getCollectibleRenderOffset(collectible)),
  );
  renderCustomCollectibleSprite(position, customSprite, scale);
}

/**
 * Renders a Custom Collectible Sprite (TMTRAINER like sprite). If you are not using
 * CustomCollectibleSprite object, use renderTMTRAINERSprite() instead.
 */
export function renderCustomCollectibleSprite(
  position: Vector,
  customSprite: CorruptedCollectibleSprite,
  scale?: Vector,
): void {
  renderTMTRAINERSprite(
    position,
    customSprite.seed,
    customSprite.horizontal ?? false,
    customSprite.color ?? false,
    scale,
    customSprite.collectibles,
  );
}

/**
 * Render a generated TMTRAINER like sprite consisting of an amalgamation of collectibles.
 *
 * @param position The position to render the sprite at.
 * @param seed
 * @param collectibles The collectibles to render, can be empty.
 * @param trinkets The trinkets to render, can be empty. Leave both 'collectibles' and 'trinkets'
 *                 empty to render a generic 'tmtrainer' sprite.
 * @param horizontal Whether the sprite should be rendered horizontally or vertically, leave
 *                   undefined to randomly choose.
 * @param color The color to render the sprite in, leave undefined to have a color, while true will
 *              render the sprite in random colors.
 * @param scale The scale to render the sprite at, leave undefined to render at 1x scale.
 */
export function renderTMTRAINERSprite(
  position: Vector,
  seed: Seed,
  horizontal: boolean,
  color: Color | true | false,
  scale: Vector | undefined,
  collectibles = [] as CollectibleType[],
): void {
  // Check if empty
  const len = collectibles.length;
  if (len === 0) {
    error("Cannot render a TMTRAINER sprite with no collectibles.");
  }
  const segmentLength = 30 / len;
  let currentLength = 0;

  collectibles.forEach((collectible) => {
    const renderPosition = position;
    const sprite = newCollectibleSprite(collectible);

    if (color !== false) {
      if (isColor(color)) {
        // Specific colour.
        sprite.Color = color;
      } else {
        // Randomly assigned colour.
        const randColor = getRandomColor(seed);
        randColor.G = clamp(randColor.G, 0.5, 1);
        randColor.B = clamp(randColor.B, 0.5, 1);
        randColor.R = clamp(randColor.R, 0.5, 1);
        sprite.Color = randColor;
      }
    }

    if (scale !== undefined) {
      sprite.Scale = scale;
    }

    if (horizontal) {
      sprite.Render(
        renderPosition,
        Vector(currentLength, 0),
        Vector(30 - (currentLength + segmentLength), 0),
      );
    } else {
      sprite.Render(
        renderPosition,
        Vector(0, currentLength),
        Vector(0, 30 - (currentLength + segmentLength)),
      );
    }
    currentLength += segmentLength;
  });
}
