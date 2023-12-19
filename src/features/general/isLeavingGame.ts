import { mod } from "../../mod";

const v = {
  room: {
    isLeaving: false,
  },
};

export function isLeavingGameInit(): void {
  mod.saveDataManager("isLeavingGame", v);
}

/**
 * Determines if the player is in the process of leaving the game (determined through PRE_GAME_EXIT
 * with a priority of Early). This is useful as certain callbacks (e.g POST_ENTITY_REMOVE) are
 * called after PRE_GAME_EXIT, so we can use this to determine if the entity is unloading due to
 * game exit or not.
 */
export function isLeavingGame(): boolean {
  return v.room.isLeaving;
}

export function isLeavingGamePreGameExitEarly(_shouldSave: boolean): void {
  v.room.isLeaving = true;
}
