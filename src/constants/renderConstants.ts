/**
 * The coordinates to render a Collectible sprite on the HUD in the Primary Active Slot. Note: you
 * should call `renderPositionToHUDPosition` on this value to get the adjusted render position.
 */
export const PRIMARY_ACTIVE_SLOT_HUD_RENDER_POSITION_PLAYER_1 = Vector(20, 38);

/**
 * The coordinates to render a Collectible sprite on the HUD in the Secondary Active Slot. Note: you
 * should call `renderPositionToHUDPosition` on this value to get the adjusted render position.
 */
export const SECONDARY_ACTIVE_SLOT_HUD_RENDER_POSITION_PLAYER_1 = Vector(3, 19);

/**
 * The coordinates to render a Collectible sprite on the HUD in the bottom pocket slot position.
 * Note: you should call `renderPositionToHUDPosition` on this value to get the adjusted render
 * position.
 */
export const POCKET_SLOT_1_HUD_RENDER_POSITION_PLAYER_1 = Vector(20, -8);

/**
 * The coordinates to render a Collectible sprite on the HUD in the second-to-bottom pocket slot
 * position. Note: you should call `renderPositionToHUDPosition` on this value to get the adjusted
 * render position.
 */
export const POCKET_SLOT_2_HUD_RENDER_POSITION_PLAYER_1 = Vector(12, 18);

/**
 * The coordinates to render a Collectible sprite on the HUD in the second-to-top pocket slot
 * position. Note: you should call `renderPositionToHUDPosition` on this value to get the adjusted
 * render position.
 */
export const POCKET_SLOT_3_HUD_RENDER_POSITION_PLAYER_1 = Vector(12, 28);

/**
 * The coordinates to render a Collectible sprite on the HUD in the top pocket slot position. Note:
 * you should call `renderPositionToHUDPosition` on this value to get the adjusted render position.
 */
export const POCKET_SLOT_4_HUD_RENDER_POSITION_PLAYER_1 = Vector(12, 38);

/**
 * The coordinates to render a Trinket sprite on the HUD in Trinket Slot 1. Note: you should call
 * `renderPositionToHUDPosition` on this value to get the adjusted render position.
 */
export const TRINKET_SLOT_1_HUD_RENDER_POSITION_PLAYER_1 = Vector(38, 3);

/**
 * The coordinates to render a Trinket sprite on the HUD in Trinket Slot 1. Note: you should call
 * `renderPositionToHUDPosition` on this value to get the adjusted render position.
 */
export const TRINKET_SLOT_2_HUD_RENDER_POSITION_PLAYER_1 = Vector(14, 27);

/** Offset needed to be added when rendering a sprite over a shop item. */
export const SHOP_ITEM_RENDER_OFFSET = Vector(0, 20);

/**
 * Offset needed for when rendering a sprite for the players' pickup animation, to add to the
 * players' position.
 */
export const PLAYER_PICKUP_ANIMATION_RENDER_OFFSET = Vector(0, -20);

export const SECONDARY_ACTIVE_SLOT_COLLECTIBLE_SPRITE_SCALE_PLAYER_1 = Vector(
  0.5,
  0.5,
);

export const POCKET_SLOT_UNFOCUSSED_COLLECTIBLE_SPRITE_SCALE_PLAYER_1 = Vector(
  0.5,
  0.5,
);

export const SECONDARY_ACTIVE_SLOT_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1 =
  Vector(0.5, 0.5);

export const POCKET_SLOT_UNFOCUSSED_CORRUPTED_COLLECTIBLE_SCALE_PLAYER_1 =
  Vector(0.5, 0.5);
