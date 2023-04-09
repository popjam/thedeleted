import { ActiveSlot } from "isaac-typescript-definitions";
import { PRIMARY_ACTIVE_SLOT_HUD_RENDER_POSITION_PLAYER_1 } from "../constants/renderConstants";

const ACTIVE_SLOT_RENDER_MAP: ReadonlyMap<ActiveSlot, Vector> = new Map([
  [ActiveSlot.PRIMARY, PRIMARY_ACTIVE_SLOT_HUD_RENDER_POSITION_PLAYER_1],
]);

/**
 * Get the coordinates on the HUD to render an active item, taking into account its size and also
 * HUD offset.
 * TODO: Update for different players.
 */
export function getActiveSlotRenderPosition(activeSlot: ActiveSlot): Vector {
  const position = ACTIVE_SLOT_RENDER_MAP.get(activeSlot);
  if (position === undefined) {
    error("Failed to get the render position for the active slot.");
  }
  return position;
}
