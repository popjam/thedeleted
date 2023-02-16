import { getHUDOffsetVector } from "isaacscript-common";

/** Full Size. */
export const PRIMARY_ACTIVE_SLOT_HUD_RENDER_POSITION = getHUDOffsetVector().add(
  Vector(20, 40),
);

/** Scale needs to be set to Vector(0.5,0.5). */
export const SECONDARY_ACTIVE_SLOT_HUD_RENDER_POSITION =
  getHUDOffsetVector().add(Vector(2, 20));

/** Offset needed to be added when rendering a sprite over a shop item. */
export const SHOP_ITEM_RENDER_OFFSET = Vector(0, 20);

/**
 * Offset needed for when rendering a sprite for the players' pickup animation, to add to the
 * players' position.
 */
export const PLAYER_PICKUP_ANIMATION_RENDER_OFFSET = Vector(0, -20);
