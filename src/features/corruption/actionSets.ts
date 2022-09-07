/**
 * Functions related to 'ActionSet' objects. ActionSets are containers for Actions ('Corrupted
 * Effects'), which usually are attached to an item. Once the player picks up the Corrupted Item,
 * all the Actions in the ActionSet are transferred to them.
 */

import { ActionSet } from "../../interfaces/corruption/ActionSet";

/**
 * Deep copies all the actions (or some if it has special properties) in an ActionSet to the player.
 *
 * @ex 'ON_PICKUP' effects are not transferred to the player, instead are immediately triggered.
 */
export function deepCopyActionSetToPlayer(
  player: EntityPlayer,
  actionSet: ActionSet,
): void {}
