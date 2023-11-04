import type { EntityID } from "isaacscript-common";
import { getConstituentsFromEntityID, spawnNPC } from "isaacscript-common";
import type { NPCID } from "../enums/general/ID/NPCID";

/** Spawn an NPC by using their NPCID. */
export function spawnNPCWithNPCID(
  npcID: NPCID,
  positionOrGridIndex: Vector | int,
  velocity?: Vector,
  spawner?: Entity | undefined,
  seedOrRNG?: Seed | RNG | undefined,
): EntityNPC {
  const constituents = getConstituentsFromEntityID(npcID as EntityID);
  return spawnNPC(
    constituents[0],
    constituents[1],
    constituents[2],
    positionOrGridIndex,
    velocity,
    spawner,
    seedOrRNG,
  );
}
