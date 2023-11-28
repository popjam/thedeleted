import { DISTANCE_OF_GRID_TILE, game } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { NPCID } from "../../../enums/data/ID/NPCID";
import {
  getRandomAccessiblePosition,
  isPositionAccessible,
} from "../../../helper/entityHelper";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import type { Range } from "../../../types/general/Range";
import { NPCSpawnType } from "../../../enums/general/NPCSpawnType";
import type { NPCAttribute } from "../../../interfaces/general/NPCAttribute";
import type { NPCFlag } from "../../../enums/general/NPCFlag";
import { addNPCFlags } from "../../../helper/entityHelper/npcFlagHelper";
import { getRandomNPC } from "../../../helper/entityHelper/npcHelper";
import {
  getNPCIDName,
  spawnNPCID,
} from "../../../helper/entityHelper/npcIDHelper";

const DEFAULT_NPC = NPCID.GAPER;
const DEFAULT_RST = NPCSpawnType.ACCESSIBLE_TO_PLAYER_BUT_AVOID_PLAYER;
const UNKNOWN_NPC_NAME_TEXT = "unknown npc";

/**
 * Response to spawn an NPC.
 *
 * @param e The NPC you want to spawn. Can be a specific NPC, or a random NPC from a group.
 * @param sp The position to spawn the NPC/s at. May override the spawn type.
 * @param rst How the NPC/s are spawned. Defaults to 'accessible to player but avoid'.
 * @param flg Custom NPC flags to modify the NPC's behavior or appearance.
 */
export class SpawnNPCResponse extends Response {
  override responseType: ResponseType = ResponseType.SPAWN_NPC;
  e?: NPCID | NPCAttribute;
  sp?: Vector;
  rst?: NPCSpawnType;
  flg?: NPCFlag[];

  /**
   * Constructor for SpawnNPCResponse.
   *
   * @param entityNPC The NPC you want to spawn. Can be a specific NPC, or a random NPC from a
   *                  group.
   * @param spawnType How the NPC/s are spawned. Defaults to 'accessible to player but avoid'.
   * @param overridePos The position to spawn the NPC/s at. May override the spawn type.
   */
  construct(
    entityNPC: NPCID | NPCAttribute,
    spawnType?: NPCSpawnType,
    overridePos?: Vector,
    amount?: number | Range,
  ): this {
    this.setNPC(entityNPC);
    if (spawnType !== undefined) {
      this.setSpawnType(spawnType);
    }
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (amount !== undefined) {
      this.setAmountOfActivations(amount);
    }
    return this;
  }

  getSpawnType(): NPCSpawnType {
    return this.rst ?? DEFAULT_RST;
  }

  setSpawnType(rst: NPCSpawnType): this {
    this.rst = rst;
    return this;
  }

  getNPCFlags(): NPCFlag[] | undefined {
    return this.flg;
  }

  setNPCFlags(flags: NPCFlag[]): this {
    this.flg = flags;
    return this;
  }

  getNPCName(): string {
    const npc = this.getNPC();
    if (typeof npc === "string") {
      return getNPCIDName(npc) ?? UNKNOWN_NPC_NAME_TEXT;
    }
    return "random npc";
  }

  getNPC(): NPCID | NPCAttribute {
    return this.e ?? DEFAULT_NPC;
  }

  setNPC(npc: NPCID | NPCAttribute): this {
    this.e = npc;
    return this;
  }

  calculateNPCFlags(spawnedNPC: EntityNPC): EntityNPC {
    const flags = this.getNPCFlags();
    if (flags === undefined) {
      return spawnedNPC;
    }
    addNPCFlags(spawnedNPC, ...flags);
    return spawnedNPC;
  }

  calculatePosition(): Vector {
    const spawnType = this.getSpawnType();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (spawnType === NPCSpawnType.ACCESSIBLE_TO_PLAYER_BUT_AVOID_PLAYER) {
      return (
        getRandomAccessiblePosition(Isaac.GetPlayer().Position) ??
        game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE)
      );
    }
    return (
      this.getPosition() ??
      getRandomAccessiblePosition(Isaac.GetPlayer().Position) ??
      game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE)
    );
  }

  spawnNPC(position: Vector): EntityNPC | undefined {
    const npc = this.getNPC();
    if (typeof npc === "string") {
      return this.calculateNPCFlags(spawnNPCID(npc, position));
    }
    // Random.
    const randomNPC = getRandomNPC(npc);
    if (randomNPC === undefined) {
      return undefined;
    }
    return this.calculateNPCFlags(spawnNPCID(randomNPC, position));
  }

  getPosition(): Vector | undefined {
    return this.sp;
  }

  setPosition(vec: Vector): this {
    this.sp = vec;
    return this;
  }

  getText(): string {
    const amountText = this.getAmountOfActivationsText();
    const amount = this.getAmountOfActivations();
    return `spawn ${amountText ?? "a"} ${this.getNPCName()}${addTheS(
      "",
      typeof amount === "number" ? amount : amount[1],
    )}`;
  }

  fire(triggerData: TriggerData): Entity | undefined {
    const player = triggerData.player ?? Isaac.GetPlayer();

    // If triggered from killing an NPC, spawn from the NPC position.
    if (
      triggerData.onKillAction !== undefined &&
      isPositionAccessible(triggerData.onKillAction.Position, player.Position)
    ) {
      return this.spawnNPC(triggerData.onKillAction.Position);
    }

    // Random accessible to player spawn position.
    return this.spawnNPC(this.calculatePosition());
  }
}
