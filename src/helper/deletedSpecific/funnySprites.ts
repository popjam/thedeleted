import {
  ActiveSlot,
  CollectibleType,
  PocketItemSlot,
} from "isaac-typescript-definitions";
import {
  clamp,
  copyColor,
  getRandomColor,
  getRandomInt,
  getRandomSeed,
  isColor,
  isRNG,
  newCollectibleSprite,
  newRNG,
} from "isaacscript-common";
import {
  POCKET_SLOT_UNFOCUSSED_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1,
  SECONDARY_ACTIVE_SLOT_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1,
} from "../../constants/renderConstants";
import { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { Range, randomInRange } from "../../types/general/Range";
import {
  getActiveRenderPosition,
  getPocketActiveRenderPosition,
} from "../HUDHelper";
import {
  getCollectibleRenderOffset,
  getRandomAssortmentOfCollectibles,
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
 * @param seedOrRNG
 * @param attributes
 */
export function renderTMTRAINERSprite(
  position: Vector,
  seedOrRNG: Seed | RNG,
  collectibles: undefined | CollectibleType[] = undefined,
  color: Color | true | false = false,
  horizontal: boolean | undefined = undefined,
  scale: Vector | undefined = undefined,
): void {
  const rng = isRNG(seedOrRNG) ? seedOrRNG : newRNG(seedOrRNG);
  collectibles =
    collectibles ??
    getRandomAssortmentOfCollectibles(undefined, undefined, rng);

  // Check if empty
  const len = collectibles.length;
  if (len === 0) {
    error("Can't render TMTRAINER sprite with empty collectible set!");
  }
  const segmentLength = 30 / len;
  let currentLength = 0;

  horizontal = horizontal ?? getRandomInt(1, 2, rng) === 1;

  collectibles.forEach((collectible) => {
    const renderPosition = position;
    const sprite = newCollectibleSprite(collectible);

    if (color !== false) {
      if (isColor(color)) {
        // Specific colour.
        sprite.Color = color;
      } else {
        // Randomly assigned colour.
        const randColor = copyColor(getRandomColor(rng));
        randColor.G = clamp(randColor.G, 0.5, 1);
        randColor.B = clamp(randColor.B, 0.5, 1);
        randColor.R = clamp(randColor.R, 0.5, 1);
        sprite.Color = randColor;
      }
    }

    if (scale !== undefined) {
      sprite.Scale = scale;
    }

    if (horizontal === true) {
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

/**
 * Render a CorruptedCollectibleSprite in the primary or secondary ActiveSlot. If you want to render
 * a CorruptedCollectibleSprite in the PocketSlots, use
 * renderCorruptedCollectibleSpriteInPocketSlot() instead. This function will also account for
 * scaling the sprite. Call this function in a render callback. TODO: Update for players.
 *
 * @param player The player to render the sprite for.
 * @param corruptedSprite The CorruptedCollectibleSprite to render.
 * @param slot The ActiveSlot to render the sprite in.
 */
export function renderCorruptedCollectibleSpriteInActiveSlot(
  player: EntityPlayer,
  corruptedSprite: CorruptedCollectibleSprite,
  slot: ActiveSlot.PRIMARY | ActiveSlot.SECONDARY,
): void {
  const position = getActiveRenderPosition(slot, player);
  renderCorruptedCollectibleSprite(
    position,
    corruptedSprite,
    slot === ActiveSlot.SECONDARY
      ? SECONDARY_ACTIVE_SLOT_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1
      : undefined,
  );
}

/**
 * Render a CorruptedCollectibleSprite in one of the four PocketItemSlots. If you want to render a
 * CorruptedCollectibleSprite in the primary or secondary ActiveSlots, use
 * renderCorruptedCollectibleSpriteInActiveSlot() instead. This function will also account for
 * scaling the sprite. Call this function in a render callback. TODO: Update for players.
 *
 * @param player The player to render the sprite for.
 * @param corruptedSprite The CorruptedCollectibleSprite to render.
 * @param pocketSlot The PocketItemSlot to render the sprite in.
 */
export function renderCorruptedCollectibleSpriteInPocketSlot(
  player: EntityPlayer,
  corruptedSprite: CorruptedCollectibleSprite,
  pocketSlot: PocketItemSlot,
): void {
  const position = getPocketActiveRenderPosition(pocketSlot, player);
  renderCorruptedCollectibleSprite(
    position,
    corruptedSprite,
    pocketSlot !== PocketItemSlot.SLOT_1
      ? POCKET_SLOT_UNFOCUSSED_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1
      : undefined,
  );
}
