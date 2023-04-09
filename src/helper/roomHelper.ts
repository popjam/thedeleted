import {
  CollectibleType,
  EntityFlag,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  getNPCs,
  getRoomAdjacentGridIndexes,
  getRoomListIndex,
} from "isaacscript-common";

/** Check if a specific room is adjacent to the room the player is currently in. */
export function isRoomAdjacent(roomListIndex: number): boolean {
  const adjacentRoomGridIndexes = Array.from(
    getRoomAdjacentGridIndexes().values(),
  );
  const adjacentRoomListIndexes = adjacentRoomGridIndexes.map((gridIndex) =>
    getRoomListIndex(gridIndex),
  );

  return adjacentRoomListIndexes.includes(roomListIndex);
}

export function floodRoom(): void {
  const npcs = getNPCs().filter(
    (npc) => !npc.HasEntityFlags(EntityFlag.FRIENDLY),
  );
  npcs.forEach((npc) => {
    npc.AddEntityFlags(EntityFlag.FRIENDLY);
  });
  Isaac.GetPlayer().UseActiveItem(CollectibleType.FLUSH, UseFlag.NO_ANIMATION);
  npcs.forEach((npc) => {
    npc.ClearEntityFlags(EntityFlag.FRIENDLY);
  });
}
