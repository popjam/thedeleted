import {
  CollectibleType,
  EntityFlag,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  game,
  getNPCs,
  getRoomAdjacentGridIndexes,
  getRoomListIndex,
  openAllDoors,
} from "isaacscript-common";

/** Check if a specific room is adjacent to the room the player is currently in. */
export function isRoomAdjacent(roomListIndex: number): boolean {
  const adjacentRoomGridIndexes = [...getRoomAdjacentGridIndexes().values()];
  const adjacentRoomListIndexes = adjacentRoomGridIndexes.map((gridIndex) =>
    getRoomListIndex(gridIndex),
  );

  return adjacentRoomListIndexes.includes(roomListIndex);
}

/** Floods a room with water similar to the 'flush' effect, without removing enemies. */
export function floodRoom(): void {
  const npcs = getNPCs().filter(
    (npc) => !npc.HasEntityFlags(EntityFlag.FRIENDLY),
  );
  for (const npc of npcs) {
    npc.AddEntityFlags(EntityFlag.FRIENDLY);
  }
  Isaac.GetPlayer().UseActiveItem(CollectibleType.FLUSH, UseFlag.NO_ANIMATION);
  for (const npc of npcs) {
    npc.ClearEntityFlags(EntityFlag.FRIENDLY);
  }
}

/**
 * If a room is not cleared, this will set the room to clear, spawn the clear reward and activate
 * any on-clear items, as well as opening all doors. This will not kill any NPCs still alive.
 */
export function clearRoom(): void {
  const room = game.GetRoom();
  if (room.IsClear()) {
    return;
  }

  room.SetClear(true);
  room.TriggerClear();
  openAllDoors();
}
