import { getPlayers } from "isaacscript-common";
import { ActionType } from "../../../../enums/corruption/actions/ActionType";
import { _addActionsToTracker } from "../../effects/playerEffects";
import { getPlayerInvertedPassiveItemActionSets } from "../passiveItemInventory";

// POST_GAME_CONTINUED, isContinued: TRUE. This is called when the game is exited and then
// continued, and used to re-add Actions to the Action tracker from saved item ActionSets.
export function _itemInventoryPostGameContinuedReordered(): void {
  for (const player of getPlayers()) {
    const actionSets = getPlayerInvertedPassiveItemActionSets(player);
    for (const actionSet of actionSets) {
      const actions = actionSet
        .getActions()
        .filter((action) => action.actionType !== ActionType.ON_OBTAIN);
      _addActionsToTracker(player, ...actions);
    }
  }
}
