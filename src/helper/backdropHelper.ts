import { BackdropType, SoundEffect } from "isaac-typescript-definitions";
import { game, saveDataManager } from "isaacscript-common";

const FRAME_COUNT = 0;
const BACKDROP_SOUND = SoundEffect.DEATH_CARD;

const v = {
  run: {
    overrideBackdrop: false,
    overriddenBackdrop: BackdropType.DUNGEON,
  },
  room: {
    realBackdrop: BackdropType.DUNGEON,
  },
};

export function backdropInit(): void {
  saveDataManager("backdrop", v);
}

/** Changes the BackdropType of the room. */
export function changeBackdrop(backdropType: BackdropType): void {
  Game().ShowHallucination(FRAME_COUNT, backdropType);
  SFXManager().Stop(BACKDROP_SOUND);
}

/** Returns the BackdropType of the room. */
export function getBackdrop(): BackdropType {
  return game.GetRoom().GetBackdropType();
}

export function postNewRoomBackdrop(): void {
  // Tracks backdrop the room originally has before modification.
  updateRealBackdrop();

  // Overridden backdrop overrides everything.
  if (v.run.overrideBackdrop) {
    changeBackdrop(v.run.overriddenBackdrop);
  }
}

/**
 * Updates the realBackdrop variable which tracks the BackdropType the room had before the backdrop
 * is manually changed.
 */
function updateRealBackdrop() {
  v.room.realBackdrop = getBackdrop();
}
