import { ActiveSlot, PocketItemSlot } from "isaac-typescript-definitions";
import {
  VectorOne,
  getHUDOffsetVector,
  getScreenBottomLeftPos,
  getScreenBottomRightPos,
  getScreenTopRightPos,
} from "isaacscript-common";
import {
  POCKET_SLOT_1_HUD_RENDER_POSITION_PLAYER_1,
  POCKET_SLOT_2_HUD_RENDER_POSITION_PLAYER_1,
  POCKET_SLOT_3_HUD_RENDER_POSITION_PLAYER_1,
  POCKET_SLOT_4_HUD_RENDER_POSITION_PLAYER_1,
  PRIMARY_ACTIVE_SLOT_HUD_RENDER_POSITION_PLAYER_1,
  SECONDARY_ACTIVE_SLOT_HUD_RENDER_POSITION_PLAYER_1,
} from "../constants/renderConstants";
import { HUDQuadrant } from "../enums/general/HUDQuandrant";

/**
 * When going from windowed to full-screen, the right quadrants of the HUD are shifted by an Offset
 * This offset needs to be subtracted from the final Vector.
 */
export function getFullScreenOffset(): Vector {
  return Options.Fullscreen ? Vector(-20, -2) : Vector(20, -2);
}

/** The HUD Offset Vector that needs to be added for rendering in the bottom left HUD quadrant. */
export function getBottomRightHUDOffsetVector(): Vector {
  return Vector(Options.HUDOffset * -16, Options.HUDOffset * -6);
}

/** The HUD Offset Vector that needs to be added for rendering in the top right HUD quadrant. */
export function getTopRightHUDOffsetVector(): Vector {
  return Vector(Options.HUDOffset * -22, Options.HUDOffset * 16);
}

/** The HUD Offset Vector that needs to be added for rendering in the bottom left HUD quadrant. */
export function getBottomLeftOffsetVector(): Vector {
  return Vector(Options.HUDOffset * 22, Options.HUDOffset * -16);
}

/**
 * Rendering on the HUD requires multiple transformations to account for:
 * - The HUD offset, a setting that can be changed by the user. This is different for each quadrant.
 * - The HUD quadrant, each quadrant shifts in a different direction when the HUD offset changes.
 * - The full-screen setting, which shifts the right quadrants of the HUD by an offset.
 *
 * @param position The position to render at.
 * @param hudQuadrant The HUD quadrant to render in. Defaults to top left. Note that you can still
 *                    render anywhere on the screen regardless of the quadrant, but it's recommended
 *                    to render in the quadrant this parameter specifies.
 */
export function HUDPositionToRenderPosition(
  position: Vector,
  hudQuadrant: HUDQuadrant = HUDQuadrant.TOP_LEFT,
): Vector {
  let newPosition = VectorOne;
  if (hudQuadrant === HUDQuadrant.TOP_LEFT) {
    newPosition = getHUDOffsetVector().add(position);
  } else if (hudQuadrant === HUDQuadrant.TOP_RIGHT) {
    newPosition = getScreenTopRightPos()
      .add(getTopRightHUDOffsetVector())
      .add(Vector(-position.X, position.Y));
  } else if (hudQuadrant === HUDQuadrant.BOTTOM_LEFT) {
    newPosition = getScreenBottomLeftPos()
      .add(getBottomLeftOffsetVector())
      .add(Vector(position.X, -position.Y));
  } else {
    newPosition = getScreenBottomRightPos()
      .add(getBottomRightHUDOffsetVector())
      .add(position.mul(-1));
  }
  return newPosition;
}

/**
 * Get the render position to render a collectible sprite in ActiveSlot 1 or ActiveSlot 2, unique to
 * each player. TODO: Update for players.
 */
export function getActiveRenderPosition(
  activeSlot: ActiveSlot.PRIMARY | ActiveSlot.SECONDARY,
  _player: EntityPlayer,
): Vector {
  switch (activeSlot) {
    case ActiveSlot.PRIMARY:
      return HUDPositionToRenderPosition(
        PRIMARY_ACTIVE_SLOT_HUD_RENDER_POSITION_PLAYER_1,
      );
    case ActiveSlot.SECONDARY:
      return HUDPositionToRenderPosition(
        SECONDARY_ACTIVE_SLOT_HUD_RENDER_POSITION_PLAYER_1,
      );
    default:
      error(`Invalid active slot: ${activeSlot}, if you want to render in the pocket slot use
      getPocketActiveRenderPosition() instead.`);
  }
}

/**
 * Get the render position for collectible sprites in the various pocket slots. Note: Some may
 * require changing the scale of the sprite. TODO: Update for players.
 */
export function getPocketActiveRenderPosition(
  pocketSlot: PocketItemSlot,
  player: EntityPlayer,
): Vector {
  switch (pocketSlot) {
    case PocketItemSlot.SLOT_1:
      return HUDPositionToRenderPosition(
        POCKET_SLOT_1_HUD_RENDER_POSITION_PLAYER_1,
        HUDQuadrant.BOTTOM_RIGHT,
      );
    case PocketItemSlot.SLOT_2:
      return HUDPositionToRenderPosition(
        POCKET_SLOT_2_HUD_RENDER_POSITION_PLAYER_1,
        HUDQuadrant.BOTTOM_RIGHT,
      );
    case PocketItemSlot.SLOT_3:
      return HUDPositionToRenderPosition(
        POCKET_SLOT_3_HUD_RENDER_POSITION_PLAYER_1,
        HUDQuadrant.BOTTOM_RIGHT,
      );
    case PocketItemSlot.SLOT_4:
      return HUDPositionToRenderPosition(
        POCKET_SLOT_4_HUD_RENDER_POSITION_PLAYER_1,
        HUDQuadrant.BOTTOM_RIGHT,
      );
    default:
      error(`Invalid pocket slot: ${pocketSlot}`);
  }
}
