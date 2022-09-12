/**
 * Functions related to 'ActionSet' objects. ActionSets are containers for Actions ('Corrupted
 * Effects'), which usually are attached to an item. Once the player picks up the Corrupted Item,
 * all the Actions in the ActionSet are transferred to them.
 */

import { deepCopy } from "isaacscript-common";
import { Action } from "../../../interfaces/corruption/actions/Action";
import { ActionSet } from "../../../interfaces/corruption/actionSets/ActionSet";
import { addActionToPlayer } from "../effects/playerEffects";

/**
 * Adds all the actions inside the ActionSet to the player, taking into account different
 * ActionSetTypes and tags. Actions will be deep copied as the same actionSets may be encountered
 * more than once.
 */
export function addActionSetToPlayer(
  player: EntityPlayer,
  actionSet: ActionSet,
): void {
  actionSet.actions.forEach((action) => {
    addActionToPlayer(player, deepCopy(action) as Action);
  });
}
