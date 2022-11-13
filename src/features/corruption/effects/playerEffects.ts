/**
 * Handles storage and modification of the Players' current corrupted actions / effects.
 * Additionally, handles the triggering of actions in their relevant callbacks.
 */

import {
  DefaultMap,
  defaultMapGetPlayer,
  getPlayers,
  PlayerIndex,
} from "isaacscript-common";
import {
  Action,
  ActionOrigin,
  isAction,
} from "../../../classes/corruption/actions/Action";
import { Response } from "../../../classes/corruption/responses/Response";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { fprint } from "../../../helper/printHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
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

// TODO: Remove false.
export function playerEffectsInit(): void {
  mod.saveDataManager("playerEffects", v);
}

export function removeActionFromPlayer(
  player: EntityPlayer,
  actionType: ActionType,
  origin?: [ActionOrigin, number],
): void {}

/**
 * Add actions to the player. If an Action is of type ActionType.ON_OBTAIN, will trigger it instead
 * of adding it to the player. Does not deepCopy!
 */
export function addActionsToPlayer(
  player: EntityPlayer,
  ...actions: Action[]
): void {
  actions.forEach((action) => {
    const playerActionsOfType = getAndSetActionArray(player, action.actionType);
    if (action.actionType === ActionType.ON_OBTAIN) {
      action.trigger({ player, action });
    } else {
      playerActionsOfType.push(action);
    }
  });
}

/**
 * This will add any Actions to the player, and trigger any Responses, without adding them. Does not
 * deepCopy!
 */
export function addActionOrResponseToPlayer(
  player: EntityPlayer,
  ...effects: Array<Action | Response>
): void {
  effects.forEach((effect) => {
    if (isAction(effect)) {
      addActionsToPlayer(player, effect);
    } else {
      effect.trigger({ player });
    }
  });
}

/** Removes an action from the player. */
export function removeFlaggedActionsOfType(
  player: EntityPlayer,
  actionType: ActionType,
): void {}

/** Triggers all Actions of the specified actionType for all Players. */
export function triggerPlayersActionsByType(
  actionType: ActionType,
  triggerData: TriggerData,
): void {
  getPlayers().forEach((player) => {
    triggerPlayerActionsByType(player, actionType, { ...triggerData });
  });
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
  playerActionsOfType.forEach((action) => {
    fprint(`Triggering: ${action.getText()}`);
    triggerData.action = action;
    action.trigger({ ...triggerData });
    if (action.ffR === true) {
      anyFlaggedForRemoval = true;
    }
  });

  // If there are any actions that are flagged for removal. Don't do this every time as it may cause
  // additional lag.
  if (anyFlaggedForRemoval) {
    let index = playerActionsOfType.length - 1;
    while (index >= 0) {
      if (playerActionsOfType[index]?.ffR === true) {
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
    throw new Error("getAndSetActionArray: Something went wrong!");
  } else {
    return actions;
  }
}
