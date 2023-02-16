import { EntityType, PickupVariant } from "isaac-typescript-definitions";
import {
  EntityID,
  NEW_RUN_PLAYER_STARTING_POSITION,
  spawnEntityID,
} from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { getRandomAccessiblePosition } from "../../../helper/entityHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";

/** An assortment of different ways to randomly spawn an Entity. */
export enum EntityRandomSpawnType {
  ACCESSIBLE_TO_PLAYER_BUT_AVOID_PLAYER,
  THROW,
}

const DEFAULT_ENTITY_ID =
  `${EntityType.PICKUP}.${PickupVariant.POOP}.0` as EntityID;
const DEFAULT_SPAWN_POSITION = NEW_RUN_PLAYER_STARTING_POSITION;
const DEFAULT_SPAWN_VELOCITY = Vector(0, 0);
const DEFAULT_RST = EntityRandomSpawnType.ACCESSIBLE_TO_PLAYER_BUT_AVOID_PLAYER;

/** Response to spawn an Pickup. */
export class SpawnPickupResponse extends Response {
  override responseType: ResponseType = ResponseType.SPAWN_PICKUP;
  e?: EntityID;
  sp?: Vector;
  v?: Vector;
  rst?: EntityRandomSpawnType;

  construct(
    entityID?: EntityID,
    rst?: EntityRandomSpawnType,
    overridePos?: Vector,
    overrideVel?: Vector,
  ): this {
    if (entityID !== undefined) {
      this.setEntityID(entityID);
    }
    if (rst !== undefined) {
      this.setRandomSpawnType(rst);
    }
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (overrideVel !== undefined) {
      this.setVelocity(overrideVel);
    }
    return this;
  }

  getRandomSpawnType(): EntityRandomSpawnType {
    return this.rst ?? DEFAULT_RST;
  }

  setRandomSpawnType(rst: EntityRandomSpawnType): this {
    this.rst = rst;
    return this;
  }

  getEntityID(): EntityID {
    return this.e ?? DEFAULT_ENTITY_ID;
  }

  setEntityID(entityID: EntityID): this {
    this.e = entityID;
    return this;
  }

  getPosition(): Vector {
    return this.sp ?? DEFAULT_SPAWN_POSITION;
  }

  setPosition(vec: Vector): this {
    this.sp = vec;
    return this;
  }

  getVelocity(): Vector {
    return this.v ?? DEFAULT_SPAWN_VELOCITY;
  }

  setVelocity(vec: Vector): this {
    this.v = vec;
    return this;
  }

  getText(): string {
    return `spawn ${this.getEntityID()}`;
  }

  fire(triggerData: TriggerData): Entity {
    // Determine the subject.
    let subject: EntityPlayer | EntityNPC | undefined = triggerData.player;
    if (triggerData.action?.actionType === ActionType.ON_KILL) {
      subject = triggerData.onKillAction;
    }
    // Spawn depending on variables.
    const rst = this.getRandomSpawnType();

    if (rst === EntityRandomSpawnType.ACCESSIBLE_TO_PLAYER_BUT_AVOID_PLAYER) {
      return spawnEntityID(
        this.getEntityID(),
        getRandomAccessiblePosition(subject?.Position ?? this.getPosition()) ??
          Vector(0, 0),
        this.getVelocity(),
      );
    }
    return spawnEntityID(
      this.getEntityID(),
      this.getPosition(),
      this.getVelocity(),
    );
  }
}
