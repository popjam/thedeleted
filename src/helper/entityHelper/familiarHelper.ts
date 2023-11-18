import type { EntityID } from "isaacscript-common";
import { spawnEntityID } from "isaacscript-common";
import type { FamiliarID } from "../../enums/general/ID/FamiliarID";

/** Spawn an NPC by using their NPCID. */
export function spawnFamiliarID(
  familiarID: FamiliarID,
  positionOrGridIndex: Vector | int,
  velocity?: Vector,
  spawner?: Entity | undefined,
  seedOrRNG?: Seed | RNG | undefined,
): EntityNPC {
  return spawnEntityID(
    familiarID as EntityID,
    positionOrGridIndex,
    velocity,
    spawner,
    seedOrRNG,
  ) as EntityNPC;
}
