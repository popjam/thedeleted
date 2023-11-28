import type { EntityID } from "isaacscript-common";
import { spawnEffect, spawnEntityID } from "isaacscript-common";
import type { EffectID } from "../../enums/data/ID/EffectID";
import { CardType } from "isaac-typescript-definitions";

/** Spawn an Entity Effect using their ID. */
export function spawnEffectID(
  effectID: EffectID,
  positionOrGridIndex: Vector | int,
  velocity?: Vector,
  spawner?: Entity | undefined,
  seedOrRNG?: Seed | RNG | undefined,
): EntityEffect {
  return spawnEntityID(
    effectID as EntityID,
    positionOrGridIndex,
    velocity,
    spawner,
    seedOrRNG,
  ) as EntityEffect;
}
