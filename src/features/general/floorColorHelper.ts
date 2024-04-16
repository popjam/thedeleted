import {
  copyColor,
  deepCopy,
  getPlayerIndex,
  getRoomListIndex,
  isColor,
} from "isaacscript-common";
import { CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE } from "../../constants/corruptionConstants";
import { simplifyAndCopyColor } from "../../helper/advancedColorHelper";
import { getPlayerMainColor } from "../../helper/deletedSpecific/deletedHelper";
import {
  isWorldInverted,
  shouldInvertedWorldHaveCorruptFloorColor,
} from "../../helper/deletedSpecific/inversion/worldInversionHelper";
import { setTemporaryFloorColor } from "../../helper/floorHelper";
import type { AdvancedColor } from "../../interfaces/general/AdvancedColor";
import { mod } from "../../mod";
import { getInvertedPlayers } from "../corruption/inversion/playerInversion";
import { fprint } from "../../helper/printHelper";

const v = {
  run: {
    floorColor: new Map<number, Color | AdvancedColor | undefined>(),
  },
  room: {
    /** The 'ladder' object used to color the current floor. */
    currentFloorColorObject: undefined as EntityPtr | undefined,

    /** The 'ladder' object which is used to color the floor. */
    corruptedFloorColorObject: new Map<number, EntityEffect>(),
  },
};

export function floorColorHelper(): void {
  mod.saveDataManager("floorColorHelper", v);
}

/**
 * Sets the floor color, by rendering a white sprite on the floor layer. This is better than the
 * setFloorColor() function from the Room class as it actually does something. The floor color will
 * be specific to that room and work even after leaving the game. Use 'setTemporaryFloorColor()' to
 * temporarily change the floor color or 'removeFloorColor()' to remove the floor color for that
 * room.
 *
 * @param color The color to set the floor to, can be an AdvancedColor or Color.
 * @param roomListIndex The room list index to set the floor color for. If undefined, will use the
 *                      current room.
 * @param overrideTransparency If true, will override the transparency of the color to make it
 *                             barely visible with the default value.
 * @returns The floor EntityEffect used to color the floor. Disappears upon leaving the room or the
 *          game.
 */
export function setFloorColor(
  color: Color | AdvancedColor,
  roomListIndex?: number,
  overrideTransparency = true,
): void {
  roomListIndex ??= getRoomListIndex();
  color = deepCopy(color);
  if (overrideTransparency) {
    if (isColor(color)) {
      color.A = CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE;
    } else {
      color.color.A = CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE;
    }
  }
  v.run.floorColor.set(roomListIndex, color);
  if (v.room.currentFloorColorObject !== undefined) {
    const ladderObject = v.room.currentFloorColorObject.Ref;
    if (ladderObject !== undefined) {
      const sprite = ladderObject.GetSprite();
      const newColor = simplifyAndCopyColor(color);
      sprite.Color = newColor;
      return;
    }
  }

  // Could not find the ladder object, so we will create a new one.
  const newLadderObject = setTemporaryFloorColor(color, overrideTransparency);
  v.room.currentFloorColorObject = EntityPtr(newLadderObject);
}

/**
 * Removes the floor color set through the 'setFloorColor()' function for the specified room.
 *
 * @param roomListIndex The room list index to remove the floor color for. If undefined, will use
 *                      the current room.
 */
export function removeFloorColor(roomListIndex?: number): void {
  if (roomListIndex === undefined || roomListIndex === getRoomListIndex()) {
    v.room.currentFloorColorObject?.Ref?.Remove();
    v.room.currentFloorColorObject = undefined;
  }
  roomListIndex ??= getRoomListIndex();
  v.run.floorColor.delete(roomListIndex);
}

export function _updateCorruptedFloorColorForPlayer(
  player: EntityPlayer,
): void {
  if (!isWorldInverted() || !shouldInvertedWorldHaveCorruptFloorColor()) {
    removeAllCorruptedFloorColor();
    return;
  }

  const mainColor = getPlayerMainColor(player);
  const playerIndex = getPlayerIndex(player);
  v.room.corruptedFloorColorObject.get(playerIndex)?.Remove();
  if (mainColor !== undefined) {
    v.room.corruptedFloorColorObject.set(
      playerIndex,
      setTemporaryFloorColor(copyColor(mainColor)),
    );
  }
}

/**
 * Update the floor color using the new 'setTemporaryFloorColor()' function. Every inverted player
 * will cast a tint on the floor, that will overlap when multiple players are inverted. There will
 * be no corrupted floor color if the world is not corrupted.
 */
export function _updateCorruptedFloorColor(): void {
  const shouldHaveFloorColor = shouldInvertedWorldHaveCorruptFloorColor();
  if (!shouldHaveFloorColor || !isWorldInverted()) {
    removeAllCorruptedFloorColor();
    return;
  }

  // World is inverted and players should have corrupted floor colors.
  for (const invertedPlayer of getInvertedPlayers()) {
    const mainColor = getPlayerMainColor(invertedPlayer);
    if (mainColor === undefined) {
      continue;
    }
    const playerIndex = getPlayerIndex(invertedPlayer);
    v.room.corruptedFloorColorObject.get(playerIndex)?.Remove();
    v.room.corruptedFloorColorObject.set(
      playerIndex,
      setTemporaryFloorColor(copyColor(mainColor)),
    );
  }
}

/** Removes all corrupted floor color effects. */
function removeAllCorruptedFloorColor() {
  fprint("Removing all corrupted floor color effects.");
  for (const effect of v.room.corruptedFloorColorObject) {
    effect[1].Remove();
  }
  v.room.corruptedFloorColorObject.clear();
  fprint("Removed all corrupted floor color effects.");
}

// POST_NEW_ROOM_REORDERED
export function floorColorHelperPostNewRoomReordered(): void {
  const roomListIndex = getRoomListIndex();
  const currentRoomFloorColor = v.run.floorColor.get(roomListIndex);
  if (currentRoomFloorColor !== undefined) {
    // Do not override transparency as that is already filtered through the initialization.
    const newLadderObject = setTemporaryFloorColor(
      currentRoomFloorColor,
      false,
    );
    v.room.currentFloorColorObject = EntityPtr(newLadderObject);
  }

  if (isWorldInverted()) {
    _updateCorruptedFloorColor();
  }
}
