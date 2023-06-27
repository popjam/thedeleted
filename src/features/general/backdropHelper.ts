import { BackdropType } from "isaac-typescript-definitions";
import { game, setBackdrop } from "isaacscript-common";
import { mod } from "../../mod";
import { hasEnteredSameRoomTwice } from "./lastRoomVisited";

const v = {
  run: {
    /** Overrides the overridden backdrop, used for the corrupted world. */
    corruptedBackdrop: false,
    realBackdrop: BackdropType.CAVES,
  },
};

export function backdropHelperInit(): void {
  mod.saveDataManager("backdropHelper", v);
}

/**
 * Permanently set the backdrop to the 'error room' backdrop. Should not use outside turning the
 * world corrupted. Will also set the corrupted floor color.
 */
// eslint-disable-next-line no-underscore-dangle
export function _setCorruptedBackdrop(): void {
  if (v.run.corruptedBackdrop) {
    return;
  }

  v.run.realBackdrop = getBackdrop();
  v.run.corruptedBackdrop = true;
  setBackdrop(BackdropType.ERROR_ROOM);
}

/**
 * Remove the permanent corrupted backdrop set by 'setCorruptedBackdrop()'. Should not use outside
 * removing the corrupted status of the world.
 */
// eslint-disable-next-line no-underscore-dangle
export function _removeCorruptedBackdrop(): void {
  if (!v.run.corruptedBackdrop) {
    return;
  }
  v.run.corruptedBackdrop = false;
  setBackdrop(v.run.realBackdrop);
}

/** Returns the BackdropType of the room. */
export function getBackdrop(): BackdropType {
  return game.GetRoom().GetBackdropType();
}

// POST_NEW_ROOM_REORDERED
export function backdropHelperPostNewRoomReordered(): void {
  if (!hasEnteredSameRoomTwice()) {
    v.run.realBackdrop = getBackdrop();
  }

  if (v.run.corruptedBackdrop) {
    setBackdrop(BackdropType.ERROR_ROOM);
  }
}
