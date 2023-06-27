import {
  ActiveSlot,
  CollectibleType,
  PocketItemSlot,
} from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { POCKET_SLOT_UNFOCUSSED_COLLECTIBLE_SPRITE_SCALE_PLAYER_1 } from "../constants/renderConstants";
import { getCollectibleSpriteFromCache } from "../features/general/spriteCache";
import { mod } from "../mod";
import {
  getActiveRenderPosition,
  getActiveRenderSize,
  getPocketActiveRenderPosition,
} from "./HUDHelper";

/** Continuously fires a function every render frame. */
export function renderConstantly(func: () => void): void {
  mod.runInNRenderFrames(() => {
    func();
    renderConstantly(func);
  }, 1);
}

/** Translates world to render coordinates, taking into account scroll offset. */
export function worldToRenderPosition(position: Vector): Vector {
  return Isaac.WorldToRenderPosition(position).add(
    game.GetRoom().GetRenderScrollOffset(),
  );
}

/**
 * Render a Collectible Sprite in the primary or secondary ActiveSlots. If you want to render an
 * item in the Pocket slots, use renderCollectibleSpriteInPocketSlot() instead. This function will
 * also account for scaling the sprite if it is in the secondary ActiveSlot. Call this function in a
 * render callback. TODO: Update for players.
 *
 * @param player The player to render the sprite for.
 * @param collectibleType The Collectible to render.
 * @param collectibleType
 * @param slot The ActiveSlot to render the sprite in.
 * @param topLeftClamp The top left clamp to use when rendering the sprite.
 * @param bottomRightClamp The bottom right clamp to use when rendering the sprite.
 * @param flipX
 */
export function renderCollectibleInActiveSlot(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  slot: ActiveSlot.PRIMARY | ActiveSlot.SECONDARY,
  topLeftClamp?: Vector,
  bottomRightClamp?: Vector,
  flipX?: boolean,
): void {
  const collectibleSprite = getCollectibleSpriteFromCache(collectibleType);
  if (flipX !== undefined) {
    collectibleSprite.FlipX = flipX;
  }
  const position = getActiveRenderPosition(slot, player);
  collectibleSprite.Scale = getActiveRenderSize(slot, player);
  collectibleSprite.Render(position, topLeftClamp, bottomRightClamp);
}

/**
 * Render a Collectible Sprite in one of the four PocketItemSlot positions. If you want to render an
 * item in the Primary or Secondary ActiveSlots, use renderCollectibleSpriteInActiveSlot() instead.
 * This function will also account for scaling the sprite if it is not focused. Call this function
 * in a render callback. TODO: Update for players.
 *
 * @param player The player to render the sprite for.
 * @param collectibleType The Collectible Type to render.
 * @param pocketSlot The PocketItemSlot to render the sprite in (bottom to top).
 * @param topLeftClamp The top left clamp to use when rendering the sprite.
 * @param bottomRightClamp The bottom right clamp to use when rendering the sprite.
 * @param flipX
 */
export function renderCollectibleInPocketSlot(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  pocketSlot: PocketItemSlot,
  topLeftClamp?: Vector,
  bottomRightClamp?: Vector,
  flipX?: boolean,
): void {
  const collectibleSprite = getCollectibleSpriteFromCache(collectibleType);
  if (flipX !== undefined) {
    collectibleSprite.FlipX = flipX;
  }
  const position = getPocketActiveRenderPosition(pocketSlot, player);
  /** If the PocketItemSlot is not focussed, it needs to be a different size. */
  if (pocketSlot !== PocketItemSlot.SLOT_1) {
    collectibleSprite.Scale =
      POCKET_SLOT_UNFOCUSSED_COLLECTIBLE_SPRITE_SCALE_PLAYER_1;
  }
  collectibleSprite.Render(position, topLeftClamp, bottomRightClamp);
}
