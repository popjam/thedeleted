import {
  ActiveSlot,
  CollectibleType,
  PocketItemSlot,
} from "isaac-typescript-definitions";
import {
  ColorDefault,
  VectorOne,
  clamp,
  getActivePocketItemSlot,
  getRandomArrayElement,
  getRandomColor,
  getRandomInt,
  getRandomSeed,
  isArray,
} from "isaacscript-common";
import {
  PEDESTAL_HEIGHT,
  POCKET_SLOT_UNFOCUSSED_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1,
  SECONDARY_ACTIVE_SLOT_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1,
} from "../../constants/renderConstants";
import { getCollectibleSpriteFromCache } from "../../features/general/spriteCache";
import type { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import type { AdvancedColor } from "../../interfaces/general/AdvancedColor";
import type { Range } from "../../types/general/Range";
import { randomInRange } from "../../types/general/Range";
import {
  getActiveRenderPosition,
  getPocketActiveRenderPosition,
} from "../HUDHelper";
import { simplifyAndCopyColor } from "../advancedColorHelper";
import {
  getCollectibleRenderOffset,
  getRandomCollectibleType,
} from "../collectibleHelper";
import { worldToRenderPosition } from "../renderHelper";
import { nextSeeds } from "../rngHelper";
import { renderSprite } from "../spriteHelper";
import { getRandomInteger } from "../randomHelper";

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
 * Renders a CorruptedCollectibleSprite over a pedestal, accounting for any offsets in pedestal type
 * (e.g shop item). Call this function in the render callback.
 */
export function renderCorruptedCollectibleSpriteOverCollectible(
  collectible: EntityPickupCollectible,
  customSprite: CorruptedCollectibleSprite,
  scale?: Vector,
): void {
  const position = worldToRenderPosition(
    collectible.Position.add(getCollectibleRenderOffset(collectible)),
  );
  renderCorruptedCollectibleSprite(position, customSprite, scale);
}

/**
 * Renders a CustomCollectibleSprite (TMTRAINER like sprite). If you are not using
 * CustomCollectibleSprite object, use renderTMTRAINERSprite() instead.
 */
export function renderCorruptedCollectibleSprite(
  position: Vector,
  customSprite: CorruptedCollectibleSprite,
  scale?: Vector,
): void {
  renderTMTRAINERSprite(
    position,
    customSprite.seed,
    customSprite.collectibles,
    customSprite.color ?? false,
    customSprite.horizontal ?? false,
    scale,
    customSprite.flipX,
    false,
    customSprite.rotation,
  );
}

/**
 * Render a generated TMTRAINER like sprite consisting of an amalgamation of collectibles.
 *
 * @param position The position to render the sprite at.
 * @param collectibles The collectibles to render, can be empty.
 * @param trinkets The trinkets to render, can be empty. Leave both 'collectibles' and 'trinkets'
 *                 empty to render a generic 'tmtrainer' sprite.
 * @param horizontal Whether the sprite should be rendered horizontally or vertically, leave
 *                   undefined to randomly choose.
 * @param color The color to render the sprite in, leave undefined to have a color, while true will
 *              render the sprite in random colors.
 * @param scale The scale to render the sprite at, leave undefined to render at 1x scale.
 * @param seed
 * @param attributes
 * @param flipX
 * @param flipY
 * @param rotation
 */
export function renderTMTRAINERSprite(
  position: Vector,
  seed: Seed,
  collectibles: CollectibleType[],
  color:
    | Color
    | Color[]
    | "random"
    | AdvancedColor
    | AdvancedColor[]
    | false = false,
  horizontal: boolean | undefined = undefined,
  scale: Vector | undefined = VectorOne,
  flipX: boolean | undefined = undefined,
  flipY: boolean | undefined = undefined,
  rotation = 0,
): void {
  // Check if empty
  const len = collectibles.length;
  if (len === 0) {
    error("Can't render TMTRAINER sprite with empty collectible set!");
  }
  const segmentLength = 30 / len;
  let currentLength = 0;

  horizontal ??= getRandomInteger(1, 2, seed) === 1;
  // if (flipX ?? false) { // Reverse the array without using array.reverse(). collectibles =
  // collectibles.reduce( (acc, val) => [val, ...acc], // eslint-disable-next-line
  // @typescript-eslint/prefer-reduce-type-parameter [] as CollectibleType[], ); }

  let i = 0;
  for (const collectible of collectibles) {
    i++;
    const renderPosition = position;
    const sprite = getCollectibleSpriteFromCache(collectible);

    if (color === false) {
      sprite.Color = ColorDefault;
    } else {
      // Get the color of the portion.
      let portionColor: Color;
      if (isArray(color)) {
        // If it is an array, use the color at the index. If the index is out of bounds, use a
        // random color from the index.
        portionColor = simplifyAndCopyColor(
          color[i - 1] ??
            getRandomArrayElement<Color | AdvancedColor>(color, seed),
        );
      } else if (typeof color === "string") {
        portionColor = getRandomColor(seed);
        portionColor.G = clamp(portionColor.G, 0.5, 1);
        portionColor.B = clamp(portionColor.B, 0.5, 1);
        portionColor.R = clamp(portionColor.R, 0.5, 1);
      } else {
        portionColor = simplifyAndCopyColor(color);
      }

      // Set the color of the sprite.
      sprite.Color = portionColor;
    }

    // sprite.FlipX = flipX ?? getRandomInteger(1, 2, nextSeeds(seed, i)) === 1; sprite.FlipY =
    // flipY ?? getRandomInteger(1, 2, nextSeeds(seed, i)) === 1;
    sprite.Scale = scale;
    sprite.Rotation = rotation;

    if (horizontal) {
      renderSprite(
        sprite,
        // Account for the pedestal offset.
        renderPosition.add(Vector(0, sprite.FlipY ? -PEDESTAL_HEIGHT : 0)),
        Vector(0, currentLength),
        Vector(0, 30 - (currentLength + segmentLength)),
      );
    } else {
      renderSprite(
        sprite,
        // Account for the pedestal offset.
        renderPosition.add(Vector(0, sprite.FlipY ? -PEDESTAL_HEIGHT : 0)),
        Vector(currentLength, 0),
        Vector(30 - (currentLength + segmentLength), 0),
      );
    }
    currentLength += segmentLength;
  }
}

/**
 * Render a CorruptedCollectibleSprite in an ActiveSlot. If ActiveSlot.POCKET is specified, will
 * adjust depending on currently selected pocket item. This function will also account for scaling
 * the sprite. Call this function in a render callback. TODO: Update for players.
 *
 * @param player The player to render the sprite for.
 * @param corruptedSprite The CorruptedCollectibleSprite to render.
 * @param slot The ActiveSlot to render the sprite in.
 */
export function renderCorruptedCollectibleSpriteInSlot(
  player: EntityPlayer,
  corruptedSprite: CorruptedCollectibleSprite,
  slot: ActiveSlot,
): void {
  if (slot === ActiveSlot.POCKET) {
    const pocketSlot = getActivePocketItemSlot(player);
    if (pocketSlot === undefined) {
      return;
    }
    const position = getPocketActiveRenderPosition(pocketSlot, player);
    renderCorruptedCollectibleSprite(
      position,
      corruptedSprite,
      pocketSlot === PocketItemSlot.SLOT_1
        ? VectorOne
        : POCKET_SLOT_UNFOCUSSED_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1,
    );
    return;
  }
  if (slot === ActiveSlot.POCKET_SINGLE_USE) {
    // Unimplemented.
    return;
  }
  const position = getActiveRenderPosition(slot, player);
  renderCorruptedCollectibleSprite(
    position,
    corruptedSprite,
    slot === ActiveSlot.SECONDARY
      ? SECONDARY_ACTIVE_SLOT_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1
      : VectorOne,
  );
}
