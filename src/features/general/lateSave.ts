import { mod } from "../../mod";
import { isLeavingGame } from "./isLeavingGame";
import { fprint } from "../../helper/printHelper";
import { countEntities } from "isaacscript-common";

const v = {
  room: {
    entitiesRemoved: 0,
  },
};

export function lateSaveInit(): void {
  mod.saveDataManager("lateSave", v);
}

/**
 * This feature saves save data during the POST_ENTITY_REMOVE callback with a priority of 'Late'.
 * This is useful as isaacscript saves data during the PRE_GAME_EXIT callback, which is called
 * before POST_ENTITY_REMOVE, allowing us to make changes to SaveData during the POST_ENTITY_REMOVE
 * callback.
 */
export function lateSavePostEntityRemoveLate(_entity: Entity): void {
  if (isLeavingGame()) {
    v.room.entitiesRemoved++;

    const { entitiesRemoved } = v.room;
    const entityCount = countEntities();

    // Only save on the last entity removed.
    if (entitiesRemoved >= entityCount) {
      fprint(`Late saving after removing ${entityCount} entities!`);
      mod.saveDataManagerSave();
    }
  }
}
