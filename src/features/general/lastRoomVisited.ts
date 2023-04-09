import { getRoomListIndex } from "isaacscript-common";
import { mod } from "../../mod";

const v = {
  run: {
    lastRoomVisited: undefined as number | undefined,
    currentRoom: 0 as number,
    hasEnteredSameRoomTwice: false,
  },
};

export function lastRoomVisitedInit(): void {
  mod.saveDataManager("lastRoomVisited", v);
}

/** Get the last unique room that the player has visited as the RoomListIndex. */
export function getLastRoomVisited(): number | undefined {
  return v.run.lastRoomVisited;
}

/**
 * Checks if the player has entered the current room more than once without visiting any other
 * rooms. This is great to check if the POST_NEW_ROOM_REORDERED callback should be ignored.
 */
export function hasEnteredSameRoomTwice(): boolean {
  return v.run.hasEnteredSameRoomTwice;
}

// POST_NEW_ROOM_REORDERED
export function lastRoomVisitedPostNewRoomReordered(): void {
  const currentRoomIndex = getRoomListIndex();
  v.run.currentRoom = currentRoomIndex;

  if (v.run.lastRoomVisited === currentRoomIndex) {
    v.run.hasEnteredSameRoomTwice = true;
  } else {
    v.run.hasEnteredSameRoomTwice = false;
    v.run.lastRoomVisited = v.run.currentRoom;
  }
}
