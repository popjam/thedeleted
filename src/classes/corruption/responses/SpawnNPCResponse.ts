import type { EntityID } from "isaacscript-common";
import { DISTANCE_OF_GRID_TILE, game, spawnEntityID } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { NPCID } from "../../../enums/general/ID/NPCID";
import {
  getRandomAccessiblePosition,
  isPositionAccessible,
} from "../../../helper/entityHelper";
import { getObjectKeyByValue } from "../../../helper/objectHelper";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";

/** An assortment of different ways to randomly spawn an Entity. */
export enum SpawnType {
  ACCESSIBLE_TO_PLAYER_BUT_AVOID_PLAYER,
  THROW,
}

const DEFAULT_NPC = NPCID.GAPER;
const DEFAULT_RST = SpawnType.ACCESSIBLE_TO_PLAYER_BUT_AVOID_PLAYER;

/** Response to spawn an NPC. */
export class SpawnNPCResponse extends Response {
  override responseType: ResponseType = ResponseType.SPAWN_NPC;
  e?: NPCID;
  sp?: Vector;
  v?: Vector;
  rst?: SpawnType;

  construct(
    entityNPC: NPCID,
    spawnType?: SpawnType,
    overridePos?: Vector,
    overrideVel?: Vector,
  ): this {
    this.setNPC(entityNPC);
    if (spawnType !== undefined) {
      this.setSpawnType(spawnType);
    }
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (overrideVel !== undefined) {
      this.setVelocity(overrideVel);
    }
    return this;
  }

  getSpawnType(): SpawnType {
    return this.rst ?? DEFAULT_RST;
  }

  setSpawnType(rst: SpawnType): this {
    this.rst = rst;
    return this;
  }

  getNPC(): NPCID {
    return this.e ?? DEFAULT_NPC;
  }

  setNPC(npc: NPCID): this {
    this.e = npc;
    return this;
  }

  getPosition(): Vector | undefined {
    return this.sp;
  }

  setPosition(vec: Vector): this {
    this.sp = vec;
    return this;
  }

  getVelocity(): Vector | undefined {
    return this.v;
  }

  setVelocity(vec: Vector): this {
    this.v = vec;
    return this;
  }

  getText(): string {
    const amount = this.getAmountOfActivationsText();
    return `spawn ${amount ?? "a"} ${
      getObjectKeyByValue(NPCID, this.getNPC()) ?? ""
    }${addTheS("", 3)}`;
  }

  fire(triggerData: TriggerData): Entity {
    const player = triggerData.player ?? Isaac.GetPlayer();

    // If triggered from killing an NPC, spawn from the NPC position.
    if (
      triggerData.onKillAction !== undefined &&
      isPositionAccessible(triggerData.onKillAction.Position, player.Position)
    ) {
      return spawnEntityID(
        this.getNPC() as EntityID,
        triggerData.onKillAction.Position,
        this.getVelocity(),
      );
    }

    const spawnType = this.getSpawnType();

    // Random accessible to player spawn position.
    if (spawnType === SpawnType.ACCESSIBLE_TO_PLAYER_BUT_AVOID_PLAYER) {
      return spawnEntityID(
        this.getNPC() as EntityID,
        getRandomAccessiblePosition(player.Position) ??
          game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE),
        this.getVelocity(),
      );
    } // Throw from player.
    if (false) {
    } else {
      // No spawn type.
      return spawnEntityID(
        this.getNPC() as EntityID,
        this.getPosition() ??
          getRandomAccessiblePosition(player.Position) ??
          game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE),
        this.getVelocity(),
      );
    }
  }
}
