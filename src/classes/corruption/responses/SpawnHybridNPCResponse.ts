import { NPCID } from "isaac-typescript-definitions";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import {
  getRandomAccessiblePosition,
  isPositionAccessible,
} from "../../../helper/positionHelper";
import {
  game,
  DISTANCE_OF_GRID_TILE,
  VectorZero,
  isArray,
} from "isaacscript-common";
import { spawnHybridNPC } from "../../facets/entityModifiers.ts/NPCModifiers/HybridNPCFacet";
import type { NPCAttribute } from "../../../interfaces/general/NPCAttribute";
import { getRandomAssortmentOfNPCs } from "../../../helper/entityHelper/npcHelper";
import {
  HYBRID_NPC_DEFAULT_NPC_AMOUNT,
  HYBRID_NPC_MINIMUM_NPC_AMOUNT,
} from "../../../constants/corruptionConstants";

const DEFAULT_SPAWN_VELOCITY = VectorZero;
const DEFAULT_NPC_MIX = [NPCID.SPIDER, NPCID.DIP] as const;

export class SpawnHybridNPCResponse extends Response {
  override responseType: ResponseType = ResponseType.SPAWN_HYBRID_NPC;
  npcs?: readonly NPCID[] | NPCAttribute;
  sp?: Vector;
  sv?: Vector;

  override construct(
    npc: readonly NPCID[] | NPCAttribute | undefined,
    overridePos?: Vector,
  ): this {
    this.setNPCs(npc);
    if (overridePos !== undefined) {
      this.setSpawnPosition(overridePos);
    }
    return this;
  }

  setNPCs(npcs: readonly NPCID[] | NPCAttribute | undefined): this {
    this.npcs = npcs;
    return this;
  }

  getNPCs(): readonly NPCID[] | NPCAttribute | undefined {
    return this.npcs;
  }

  setSpawnPosition(sp: Vector): this {
    this.sp = sp;
    return this;
  }

  getSpawnPosition(): Vector | undefined {
    return this.sp;
  }

  setSpawnVelocity(sv: Vector): this {
    this.sv = sv;
    return this;
  }

  getSpawnVelocity(): Vector | undefined {
    return this.sv;
  }

  calculateSpawnPosition(triggerData: TriggerData): Vector {
    const sp = this.getSpawnPosition();
    if (sp !== undefined) {
      return sp;
    }

    const triggerDataPosition = triggerData.spawnPosition;
    if (
      triggerDataPosition &&
      isPositionAccessible(
        triggerDataPosition,
        triggerData.player?.Position ?? Isaac.GetPlayer().Position,
      )
    ) {
      return triggerDataPosition;
    }

    return (
      getRandomAccessiblePosition(Isaac.GetPlayer().Position) ??
      game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE)
    );
  }

  calculateSpawnVelocity(triggerData: TriggerData): Vector {
    const sv = this.getSpawnVelocity();
    if (sv !== undefined) {
      return sv;
    }

    const triggerDataVelocity = triggerData.spawnVelocity;
    if (triggerDataVelocity) {
      return triggerDataVelocity;
    }

    return DEFAULT_SPAWN_VELOCITY;
  }

  calculateNPCs(_triggerData: TriggerData): readonly NPCID[] {
    let npcs = this.getNPCs();

    // Random NPC.
    if (npcs === undefined) {
      return (
        getRandomAssortmentOfNPCs(HYBRID_NPC_DEFAULT_NPC_AMOUNT) ??
        DEFAULT_NPC_MIX
      );
    }

    // NPCAttribute.
    if (!isArray(npcs)) {
      npcs = getRandomAssortmentOfNPCs(
        HYBRID_NPC_DEFAULT_NPC_AMOUNT,
        npcs as NPCAttribute,
      );
    }

    if (npcs === undefined || npcs.length < HYBRID_NPC_MINIMUM_NPC_AMOUNT) {
      return DEFAULT_NPC_MIX;
    }

    return npcs as readonly NPCID[];
  }

  override getVerb(_participle: boolean): string {
    return "";
  }

  override getNoun(_eid: boolean): string {
    return "";
  }

  override getText(_eid: boolean, _participle: boolean): string {
    return "";
  }

  override fire(triggerData: TriggerData): EntityNPC {
    const spawnPosition = this.calculateSpawnPosition(triggerData);
    const _spawnVelocity = this.calculateSpawnVelocity(triggerData);
    const npcs = this.calculateNPCs(triggerData);

    return spawnHybridNPC(spawnPosition, ...npcs);
  }
}
