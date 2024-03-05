import type { Response } from "../../../classes/corruption/responses/Response";
import { _addActionOrResponseToTracker } from "../../../features/corruption/effects/playerEffects";

/**
 * Add Responses to a player, which will be triggered immediately. Note: these will be wiped upon
 * save/load, unless they're saved elsewhere.
 */
export function addResponsesToTracker(
  player: EntityPlayer,
  ...response: Response[]
): void {
  _addActionOrResponseToTracker(player, ...response);
}
