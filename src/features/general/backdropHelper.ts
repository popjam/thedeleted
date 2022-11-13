import { BackdropType, SoundEffect } from "isaac-typescript-definitions";
import { game, setBackdrop } from "isaacscript-common";
import { mod } from "../../mod";

const FRAME_COUNT = 0;
const BACKDROP_SOUND = SoundEffect.DEATH_CARD;

const v = {
  run: {
    /** If set to true, the backdrop will permanently be overridden. */
    overrideBackdrop: false,
    /** What to override the backdrop to. */
    overriddenBackdrop: BackdropType.DUNGEON,
  },
  room: {
    /** Backdrop of the room before it changes to an overridden backdrop. */
    realBackdrop: BackdropType.DUNGEON,
  },
};

export function backdropInit(): void {
  mod.saveDataManager("backdrop", v);
}

/**
 * Override the backdrop permanently. Calling this function will immediately change the backdrop.
 * This will override the backdrop in every room, until removeOverriddenBackdrop() is called.
 */
export function overrideBackdrop(backdropType: BackdropType): void {
  v.run.overriddenBackdrop = backdropType;
  v.run.overrideBackdrop = true;
  setBackdrop(backdropType);
}

/** Removes the overridden backdrop. */
export function removeOverriddenBackdrop(): void {
  v.run.overrideBackdrop = false;
  setBackdrop(v.room.realBackdrop);
}

/** Returns the BackdropType of the room. */
export function getBackdrop(): BackdropType {
  return game.GetRoom().GetBackdropType();
}

export function postNewRoomReorderedBackdrop(): void {
  // Tracks backdrop the room originally has before modification.
  updateRealBackdrop();

  // Overridden backdrop overrides everything.
  if (v.run.overrideBackdrop) {
    setBackdrop(v.run.overriddenBackdrop);
  }
}

/**
 * Updates the realBackdrop variable which tracks the BackdropType the room had before the backdrop
 * is manually changed.
 */
function updateRealBackdrop() {
  v.room.realBackdrop = getBackdrop();
}
