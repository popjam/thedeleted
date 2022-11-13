import { EntityType, PickupVariant } from "isaac-typescript-definitions";
import {
  EntityID,
  NEW_RUN_PLAYER_STARTING_POSITION,
  spawnEntityID,
} from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { Response } from "./Response";

const DEFAULT_ENTITY_ID =
  `${EntityType.PICKUP}.${PickupVariant.POOP}.0` as EntityID;
const DEFAULT_SPAWN_POSITION = NEW_RUN_PLAYER_STARTING_POSITION;

enum FindEntityMethod {
  RANDOM_IN_SMALL_RADIUS,
  RANDOM_IN_LARGE_RADIUS,
  RANDOM_IN_ROOM,
  CLOSEST_TO_PLAYER,
}

/** Response to spawn an Entity. */
export class RemoveEntityResponse extends Response {
  override responseType: ResponseType = ResponseType.REMOVE_ENTITY;
  e?: EntityID;
  sp?: Vector;

  getEntityID(): EntityID {
    return this.e ?? DEFAULT_ENTITY_ID;
  }

  setEntityID(entityID: EntityID): this {
    this.e = entityID;
    return this;
  }

  getSpawnPosition(): Vector {
    return this.sp ?? DEFAULT_SPAWN_POSITION;
  }

  setSpawnPosition(vec: Vector): this {
    this.sp = vec;
    return this;
  }

  getText(): string {
    return "";
  }

  fire(): void {
    spawnEntityID(this.getEntityID(), this.getSpawnPosition());
  }
}
