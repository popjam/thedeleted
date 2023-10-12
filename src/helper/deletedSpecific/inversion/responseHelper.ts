import type { Response } from "../../../classes/corruption/responses/Response";
import { addActionOrResponseToTracker } from "../../../features/corruption/effects/playerEffects";

/** Add Responses to a player, which will be triggered immediately. */
export function addResponsesToPlayer(
  player: EntityPlayer,
  ...response: Response[]
): void {
  addActionOrResponseToTracker(player, ...response);
}
