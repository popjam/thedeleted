/**
 * Handles storage and modification of the Players' current corrupted actions / effects.
 * Additionally, handles the triggering of actions in their relevant callbacks.
 */

import {
  arrayRemove,
  arrayRemoveIndexInPlace,
  DefaultMap,
  defaultMapGetPlayer,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { ActionType } from "../../enums/corruption/ActionType";
import { Action } from "../../interfaces/corruption/Action";
import { triggerAction } from "./actions";

const playerActionsCreateMap = () => new Map<ActionType, Action[]>();

const v = {
  run: {
    /**
     * Actions stored on a player are categorized into Action arrays separated by their ActionType.
     * This is to make it less resource intensive to trigger all actions of a specific type at once
     * (as that is the purpose of actions, to trigger at a specific point or game event).
     */
    playerActions: new DefaultMap<PlayerIndex, Map<ActionType, Action[]>>(
      playerActionsCreateMap,
    ),
  },
};

export function corruptPlayersInit(): void {
  saveDataManager("corruptPlayers", v);
}

/** Adds an action to the player. Does not deepCopy, so you may need to do this beforehand. */
export function addActionToPlayer(player: EntityPlayer, action: Action): void {
  getAndSetActionArray(player, action.actionType).push(action);
}

/** Removes an action from the player. */
export function removeActionFromPlayer(
  player: EntityPlayer,
  action: Action,
): void {
  const map = getAndSetActionArray(player, action.actionType);
  arrayRemove(map, action);
}

/**
 * Iterates all functions in the players' action array of the specified ActionType. Will also remove
 * actions which are 'flaggedForRemoval' after triggering them.
 */
export function triggerAllPlayerActionsByType(
  player: EntityPlayer,
  actionType: ActionType,
): void {
  const actionArray = getAndSetActionArray(player, actionType);
  for (let i = 0; i < actionArray.length; i++) {
    const action = actionArray[i];
    if (action !== undefined) {
      triggerAction(action, player);
      if (action.tags?.flagForRemoval) {
        arrayRemoveIndexInPlace(actionArray, i);
        i--;
      }
    }
  }
}

/**
 * Function to simulate DefaultMap functionality for the Map<ActionType, Action[]> map, as you
 * cannot save nested DefaultMaps. Returns array of actions for player, creating one if necessary.
 */
function getAndSetActionArray(
  player: EntityPlayer,
  actionType: ActionType,
): Action[] {
  const actionTypeMap = defaultMapGetPlayer(v.run.playerActions, player).get(
    actionType,
  );
  if (actionTypeMap === undefined) {
    defaultMapGetPlayer(v.run.playerActions, player).set(actionType, []);
  }
  return defaultMapGetPlayer(v.run.playerActions, player).get(actionType)!;
}
