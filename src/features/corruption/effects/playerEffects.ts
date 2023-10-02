import type { PlayerIndex } from "isaacscript-common";
import {
  DefaultMap,
  defaultMapGetPlayer,
  getPlayers,
} from "isaacscript-common";
import type { Action } from "../../../classes/corruption/actions/Action";
import { isAction } from "../../../classes/corruption/actions/Action";
import type { Response } from "../../../classes/corruption/responses/Response";
import type { ActionOrigin } from "../../../enums/corruption/actions/ActionOrigin";
import type { ActionType } from "../../../enums/corruption/actions/ActionType";
import { fprint } from "../../../helper/printHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { mod } from "../../../mod";

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

/**
 * We are no longer saving player effects to disk. Instead, we save player ActionSets to disk, and
 * each time the game is loaded, we re-create the player effects from the ActionSets. This allows us
 * easier management of the players inverted items, while also allowing us to save individual
 * effects here for increased performance.
 *
 * When an ActionSet is added to the player, we also add its Actions here. They both share the same
 * space in memory, so we can easily access them from either place without having to worry about
 * syncing them.
 */
export function playerEffectsInit(): void {
  mod.saveDataManager("playerEffects", v, false);
}

export function removeActionFromPlayer(
  player: EntityPlayer,
  actionType: ActionType,
  origin?: [ActionOrigin, number],
): void {}

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
 */
export function addActionsToTracker(
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
export function addActionOrResponseToTracker(
  player: EntityPlayer,
  ...effects: Array<Action | Response>
): void {
  for (const effect of effects) {
    if (isAction(effect)) {
      addActionsToTracker(player, effect);
    } else {
      effect.trigger({ player });
    }
  }
}

/** Removes actions that are flagged for removal from the player. */
export function removeFlaggedActionsOfType(
  player: EntityPlayer,
  actionType: ActionType,
): void {
  removeAllActionsWithPredicate(
    (action: Action) => action.getFlagForRemoval(),
    player,
    actionType,
  );
}

/** Get an array of ActionTypes that the player has Actions of. */
export function getPlayerActionTypes(player: EntityPlayer): ActionType[] {
  return [...defaultMapGetPlayer(v.run.playerActions, player).keys()];
}

/**
 * Removes one Action that matches the predicate, player and ActionType. If an Action is found, the
 * function returns it. If not, it returns undefined. If a player is not specified, it looks through
 * all players. If an actionType is not specified, it looks through all actionTypes.
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
          playerActionsOfType.splice(index, 1);
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
export function removeAllActionsWithPredicate(
  predicate: (action: Action) => boolean,
  player?: EntityPlayer,
  actionType?: ActionType,
): Action[] {
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
          playerActionsOfType.splice(index, 1);
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
): void {
  triggerData.player ??= player;
  let anyFlaggedForRemoval = false as boolean;
  const playerActionsOfType = getAndSetActionArray(player, actionType);
  for (const action of playerActionsOfType) {
    fprint(`Triggering: ${action.getText()}`);
    triggerData.action = action;
    action.trigger({ ...triggerData });
    if (action.ffR === true) {
      anyFlaggedForRemoval = true;
    }
  }

  // If there are any actions that are flagged for removal. Don't do this every time as it may cause
  // additional lag. Will not remove actions with 'permanent' tag.
  if (anyFlaggedForRemoval) {
    let index = playerActionsOfType.length - 1;
    while (index >= 0) {
      const action = playerActionsOfType[index];
      if (
        action !== undefined &&
        action.ffR === true &&
        !action.getPermanence()
      ) {
        fprint(`Removing: ${playerActionsOfType[index]?.getText()}`);
        playerActionsOfType.splice(index, 1);
      }
      index--;
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
  const actions = defaultMapGetPlayer(v.run.playerActions, player).get(
    actionType,
  );
  if (actions === undefined) {
    error("getAndSetActionArray: Something went wrong!");
  } else {
    return actions;
  }
}
