import { mod } from "../../mod";
import { isLeavingGame } from "./isLeavingGame";

/**
 * This feature saves save data during the POST_ENTITY_REMOVE callback with a priority of 'Late'.
 * This is useful as isaacscript saves data during the PRE_GAME_EXIT callback, which is called
 * before POST_ENTITY_REMOVE, allowing us to make changes to SaveData during the POST_ENTITY_REMOVE
 * callback. The downside is that this feature will save data every time an entity is removed after
 * a game exit, potentially causing a lag spike.
 */
export function lateSavePostEntityRemoveLate(_entity: Entity): void {
  if (isLeavingGame()) {
    mod.saveDataManagerSave();
  }
}
