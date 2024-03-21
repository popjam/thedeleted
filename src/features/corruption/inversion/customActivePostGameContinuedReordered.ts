import { getPlayers } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { _addActionsToTracker } from "../effects/playerEffects";
import { getAllCustomActivesWithSlot } from "./customActives";

// POST_GAME_CONTINUED, isContinued: TRUE. This is called when the game is exited and then
// continued, and used to re-add Actions to the Action tracker from saved item ActionSets.
export function _customActiveInventoryPostGameContinuedReordered(): void {
  for (const player of getPlayers()) {
    const customActives = getAllCustomActivesWithSlot(player);
    for (const [_slot, customActive] of customActives) {
      const actions = customActive
        .getActions()
        .filter((action) => action.actionType !== ActionType.ON_OBTAIN);
      _addActionsToTracker(player, ...actions);
    }
  }
}
