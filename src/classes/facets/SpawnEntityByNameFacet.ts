import { Callback, spawnEntityID } from "isaacscript-common";
import { Facet, initGenericFacet } from "../Facet";
import { fprint } from "../../helper/printHelper";
import type { EntityType } from "isaac-typescript-definitions";
import { ModCallback } from "isaac-typescript-definitions";
import { getEntityFromInitSeed } from "../../helper/entityHelper";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    spawnedEntity: undefined as Seed | undefined,
  },
};

let FACET: Facet | undefined;
class SpawnEntityByNameFacet extends Facet {
  @Callback(ModCallback.PRE_ENTITY_SPAWN)
  preEntitySpawn(
    entityType: EntityType,
    variant: int,
    subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ):
    | [entityType: EntityType, variant: int, subType: int, initSeed: Seed]
    | undefined {
    v.room.spawnedEntity = initSeed;
    return undefined;
  }
}

export function initSpawnEntityByNameFacet(): void {
  FACET = initGenericFacet(SpawnEntityByNameFacet, v);
}

export function spawnEntityByName(
  entityName: string,
  position?: Vector,
  velocity?: Vector,
): Entity | undefined {
  if (FACET === undefined) {
    error("The spawn entity by name facet is not initialized.");
  }
  if (!FACET.isInitialized()) {
    fprint("Initializing LastSpawnedEntityFacet...");
    FACET.subscribeIfNotAlready();
  }

  // This will spawn the entity in the middle of the room.
  Isaac.ExecuteCommand(`spawn ${entityName}`);

  const lastSpawnedEnt = v.room.spawnedEntity;
  if (lastSpawnedEnt === undefined) {
    FACET.uninit();
    v.room.spawnedEntity = undefined;
    return undefined;
  }

  // We assume that the last spawned entity is the one we want.
  const entity = getEntityFromInitSeed(lastSpawnedEnt);
  if (entity === undefined) {
    FACET.uninit();
    v.room.spawnedEntity = undefined;
    return undefined;
  }

  if (position !== undefined) {
    entity.Position = position;
  }

  if (velocity !== undefined) {
    entity.Velocity = velocity;
  }

  FACET.unsubscribeAll();
  v.room.spawnedEntity = undefined;
  return entity;
}
