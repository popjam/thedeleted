import type { PlayerIndex } from "isaacscript-common";
import {
  DefaultMap,
  defaultMapGetPlayer,
  getPlayers,
  isActiveCollectible,
} from "isaacscript-common";
import type { Action } from "../../../classes/corruption/actions/Action";
import { isAction } from "../../../classes/corruption/actions/Action";
import type { Response } from "../../../classes/corruption/responses/Response";
import type { ActionType } from "../../../enums/corruption/actions/ActionType";
import { fprint } from "../../../helper/printHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";
import { _removeActionFromCorruptInventory } from "../inventory/passiveItemInventory";
import { _removeActionFromCustomActive } from "../inversion/customActives";

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

    /**
     * Temporary Action ID - For Actions added to the tracker that are independent of ActionSets and
     * are permanent, they need a unique ID so they can be retrieved for removal.
     */
    temporaryActionID: 0,
  },
};

/**
 * Actions are saved to disk. However, to prevent redundancy, Actions which belong to an ActionSet
 * that belongs to an item are wiped from disk upon exiting the game. They are re-added every time
 * the game starts up again. This allows us easier management of the players inverted items, while
 * also allowing us to save individual effects here for increased performance.
 *
 * Currently temporary actions are removed in the PRE_GAME_EXIT callback, but note that we're saving
 * data on the last POST_ENTITY_REMOVE callback, which is called after the PRE_GAME_EXIT callback.
 * Actions should not be added in any of these callbacks.
 *
 * When an ActionSet is added to the player, we also add its Actions here. They both share the same
 * space in memory, so we can easily access them from either place without having to worry about
 * syncing them.
 *
 * To add an Action that is saved to disk, the 'permanent' flag should be set to true.
 */
export function playerEffectsInit(): void {
  mod.saveDataManager("playerEffects", v);
}

/**
 * Adds the specified Action to the player. This will be saved to disk. This will not deepCopy!
 *
 * Use this function when you want to add an action to the player, independent of an ActionSet.
 * Despite being named 'temporary', this does not handle removing the action. To do so, you should
 * probably use the 'TemporaryActionResponse' Response.
 *
 * @param player The player to add the action to.
 * @param action The action to add.
 *
 * @returns The unique TemporaryActionID of the action. To remove the action, use
 *          'removeTemporaryActionFromPlayer' with this ID.
 */
export function addTemporaryActionToPlayer(
  player: EntityPlayer,
  action: Action,
): int {
  // Create a unique ID for the action.
  const newTemporaryActionID = v.run.temporaryActionID++;
  action.setTemporaryActionID(newTemporaryActionID);
  _addActionsToTracker(player, action);
  return newTemporaryActionID;
}

/**
 * Removes a temporary action from the player using the unique TemporaryActionID.
 *
 * @param player The player entity.
 * @param temporaryActionID The ID of the temporary action to remove.
 *
 * @param actionType
 * @returns The removed action, if found.
 */
export function removeTemporaryActionFromPlayer(
  player: EntityPlayer,
  temporaryActionID: int,
  actionType?: ActionType,
): Action | undefined {
  return removeActionWithPredicate(
    (action) => action.getTemporaryActionID() === temporaryActionID,
    player,
    actionType,
  );
}

/**
 * Removes the specified Action from the tracker, by checking if they reference the same object.
 * This shouldn't get called outside of specific circumstances.
 */
export function _removeActionFromTracker(
  player: EntityPlayer,
  action: Action,
): void {
  removeActionWithPredicate(
    (actionLoop) => actionLoop === action,
    player,
    action.actionType,
  );
}

/** Get the total number of Actions between all players. */
export function getTotalNumActions(): int {
  let totalNumActions = 0;
  for (const player of getPlayers()) {
    totalNumActions += getNumActions(player);
  }
  return totalNumActions;
}

/** Get the total number of Actions the player has. */
export function getNumActions(player: EntityPlayer): int {
  let numActions = 0;
  for (const [, actionsOfType] of defaultMapGetPlayer(
    v.run.playerActions,
    player,
  )) {
    numActions += actionsOfType.length;
  }
  return numActions;
}

/**
 * Add actions to the tracker. These actions should be references to the Actions in player-held
 * ActionSets, and hence will be removed upon exiting the game. They should be re-added every time
 * the game starts up again. As they need to point to the same object, this does not deepCopy.
 *
 * Actions added through this method that are not saved upon exiting, and should generally only be
 * used upon adding an ActionSet!
 *
 * This should not be used outside of specific scenarios, use 'addPermanentActionsToPlayer' instead,
 * as this will not save the actions to disk.
 */
export function _addActionsToTracker(
  player: EntityPlayer,
  ...actions: Action[]
): void {
  for (const action of actions) {
    const playerActionsOfType = getAndSetActionArray(player, action.actionType);
    playerActionsOfType.push(action);
  }
}

/**
 * This will add any Actions to the player, and trigger any Responses, without adding them. Does not
 * deepCopy!
 *
 * Actions added through this method that are not saved upon exiting, and should generally only be
 * used upon adding an ActionSet!
 */
export function _addActionOrResponseToTracker(
  player: EntityPlayer,
  ...effects: Array<Action | Response>
): void {
  for (const effect of effects) {
    if (isAction(effect)) {
      _addActionsToTracker(player, effect);
    } else {
      effect.trigger({ player });
    }
  }
}

/** Removes actions that are flagged for removal from the player. */
export function _removeFlaggedActionsOfType(
  player: EntityPlayer,
  actionType: ActionType,
): void {
  _removeAllActionsWithPredicate(
    (action: Action) => action.getFlagForRemoval(),
    player,
    actionType,
  );
}

/** Get an array of ActionTypes that the player has Actions of. */
export function getPlayerActionTypes(
  player: EntityPlayer,
): readonly ActionType[] {
  return [...defaultMapGetPlayer(v.run.playerActions, player).keys()];
}

/**
 * Removes one Action that matches the predicate, player and ActionType. If an Action is found, the
 * function returns it. If not, it returns undefined. If a player is not specified, it looks through
 * all players. If an actionType is not specified, it looks through all actionTypes.
 *
 * Note that this will not remove the action from the ActionSet it belongs to, only from the
 * tracker.
 */
export function removeActionWithPredicate(
  predicate: (action: Action) => boolean,
  player?: EntityPlayer,
  actionType?: ActionType,
): Action | undefined {
  const playersLoop = player === undefined ? getPlayers() : [player];

  for (const playerLoop of playersLoop) {
    const actionTypesLoop =
      actionType === undefined
        ? getPlayerActionTypes(playerLoop)
        : [actionType];
    for (const actionTypeLoop of actionTypesLoop) {
      const playerActionsOfType = getAndSetActionArray(
        playerLoop,
        actionTypeLoop,
      );
      let index = playerActionsOfType.length - 1;
      while (index >= 0) {
        const action = playerActionsOfType[index];
        if (action !== undefined && predicate(action)) {
          playerActionsOfType.splice(index, 1); // TODO: Remove from ActionSet?
          return action;
        }
        index--;
      }
    }
  }
  return undefined;
}

/**
 * Removes all actions that match the predicate, player and actionType specified. If no player is
 * mentioned, will remove from all players. If no actionType is mentioned, will remove from all
 * actionTypes. Returns an array of the removed actions, which will be empty if nothing matches.
 */
export function _removeAllActionsWithPredicate(
  predicate: (action: Action) => boolean,
  player?: EntityPlayer,
  actionType?: ActionType,
): readonly Action[] {
  const playersLoop = player === undefined ? getPlayers() : [player];
  const removedActions: Action[] = [];

  for (const playerLoop of playersLoop) {
    const actionTypesLoop =
      actionType === undefined
        ? getPlayerActionTypes(playerLoop)
        : [actionType];
    for (const actionTypeLoop of actionTypesLoop) {
      const playerActionsOfType = getAndSetActionArray(
        playerLoop,
        actionTypeLoop,
      );
      let index = playerActionsOfType.length - 1;
      while (index >= 0) {
        const action = playerActionsOfType[index];
        if (action !== undefined && predicate(action)) {
          playerActionsOfType.splice(index, 1); // TODO: Remove from ActionSet?
          removedActions.push(action);
        }
        index--;
      }
    }
  }
  return removedActions;
}

/** Triggers all Actions of the specified actionType for all Players. */
export function triggerPlayersActionsByType(
  actionType: ActionType,
  triggerData: TriggerData,
): void {
  for (const player of getPlayers()) {
    triggerPlayerActionsByType(player, actionType, { ...triggerData });
  }
}

/**
 * Iterates all functions in the players' action array of the specified ActionType. Will also remove
 * actions which are 'flaggedForRemoval' after triggering them.
 */
export function triggerPlayerActionsByType(
  player: EntityPlayer,
  actionType: ActionType,
  triggerData: TriggerData,
): readonly unknown[] {
  triggerData.player ??= player;
  const playerActionsOfType = getAndSetActionArray(player, actionType);
  const returnValues: unknown[] = [];
  for (const action of playerActionsOfType) {
    fprint(`Triggering: ${action.getText()}`);
    triggerData.action = action;
    const returnValue = action.trigger({ ...triggerData });
    returnValues.push(returnValue);

    // Remove the action if it's flagged for removal.
    if (action.getFlagForRemoval()) {
      _removeActionFromTracker(player, action);

      // If the Action is from an inverted collectible, remove it from the ActionSet.
      const collectibleOrigin = action.getInvertedCollectibleOrigin();
      if (collectibleOrigin !== undefined) {
        if (isActiveCollectible(collectibleOrigin)) {
          _removeActionFromCustomActive(player, collectibleOrigin, action);
        } else {
          _removeActionFromCorruptInventory(player, collectibleOrigin, action);
        }
      }
    }
  }

  return returnValues;
}

/**
 * Function to simulate DefaultMap functionality for the Map<ActionType, Action[]> map, as you
 * cannot save nested DefaultMaps. Returns array of actions for player, creating one if necessary.
 */
// eslint-disable-next-line isaacscript/no-mutable-return
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
  const actions = defaultMapGetPlayer(v.run.playerActions, player).get(
    actionType,
  );
  if (actions === undefined) {
    error("getAndSetActionArray: Something went wrong!");
  } else {
    return actions;
  }
}

/** Removes actions that are from inverted collectibles. */
export function _preGameExitRemoveInvertedCollectibleActions(): void {
  const { playerActions } = v.run;
  // Loop through playerActions, and remove any actions that are from inverted collectibles.
  for (const playerActionsOfType of playerActions.values()) {
    for (const actions of playerActionsOfType.values()) {
      let index = actions.length - 1;
      while (index >= 0) {
        const action = actions[index];
        if (action !== undefined && action.isFromInvertedCollectible()) {
          actions.splice(index, 1);
        }
        index--;
      }
    }
  }
}
