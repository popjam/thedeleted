import type { CollectibleType } from "isaac-typescript-definitions";
import { ActiveSlot, PocketItemSlot } from "isaac-typescript-definitions";
import { game, getActivePocketItemSlot } from "isaacscript-common";
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

export function renderToWorldPosition(position: Vector): Vector {
  return Isaac.ScreenToWorld(position);
}

/**
 * Renders a collectible in a slot. If the slot is a Pocket slot, the collectible will be rendered
 * in the correct position depending on where the Pocket slot is.
 *
 * @param player The player to render the collectible for.
 * @param collectibleType The collectible to render.
 * @param slot The slot to render the collectible in.
 * @param topLeftClamp The top left clamp for the sprite.
 * @param bottomRightClamp The bottom right clamp for the sprite.
 * @param flipX Whether to flip the sprite on the X axis.
 */
export function renderCollectibleInSlot(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  slot: ActiveSlot,
  topLeftClamp?: Vector,
  bottomRightClamp?: Vector,
  flipX?: boolean,
): void {
  // Get the sprite from the cache.
  const collectibleSprite = getCollectibleSpriteFromCache(collectibleType);

  // Flip the sprite if necessary.
  if (flipX !== undefined) {
    collectibleSprite.FlipX = flipX;
  }

  // Get the position to render the sprite at. This is different for Pocket slots, as they can be in
  // different positions.
  let position: Vector | undefined;
  if (slot === ActiveSlot.POCKET) {
    const pocketSlot = getActivePocketItemSlot(player);
    if (pocketSlot === undefined) {
      return;
    }
    position = getPocketActiveRenderPosition(pocketSlot, player);

    // Scale the sprite if it is not in the first PocketItemSlot.
    if (pocketSlot !== PocketItemSlot.SLOT_1) {
      collectibleSprite.Scale =
        POCKET_SLOT_UNFOCUSSED_COLLECTIBLE_SPRITE_SCALE_PLAYER_1;
    }
  } else if (slot === ActiveSlot.POCKET_SINGLE_USE) {
    // Unimplemented.
  } else {
    position = getActiveRenderPosition(slot, player);

    // Scale.
    collectibleSprite.Scale = getActiveRenderSize(slot, player);
  }

  if (position === undefined) {
    return;
  }

  // Render the sprite.
  collectibleSprite.Render(position, topLeftClamp, bottomRightClamp);
}
