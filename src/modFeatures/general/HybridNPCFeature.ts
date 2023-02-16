import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  EntityID,
  GAME_FRAMES_PER_SECOND,
  getConstituentsFromEntityID,
  VectorZero,
} from "isaacscript-common";
import { NPCID } from "../../enums/general/NPCID";
import { getRandomAccessiblePosition } from "../../helper/entityHelper";
import { fprint } from "../../helper/printHelper";
import { mod } from "../../mod";
import { CustomModFeature } from "../CustomModFeature";

export interface HybridNPCInstance {
  npcs: NPCID[];
  current: number;
  index: number;
  time: number;
}

export interface HybridNPCInput {
  npcs: NPCID[];
}

export class HybridNPCFeature extends CustomModFeature<HybridNPCInstance> {
  override v = {
    run: {
      subscribers: new Map<number, HybridNPCInstance>([]),
      ids: 0,
    },
  };

  /**
   * Once this feature is enabled, every item spawned will be of one CollectibleType.
   *
   * If there are multiple subscribers, it will favor the most recent addition.
   */
  override subscribe(...npc: NPCID[]): number {
    return this.subscribeWithInput({
      npcs: [...npc],
    });
  }

  override subscribeWithInput(input: HybridNPCInput): number {
    fprint("Subscribing to HybridNPCFeature!");

    // Spawn the HybridNPC.
    const firstNPC = input.npcs[0] ?? NPCID.ATTACK_FLY;
    const persistentEntity = mod.spawnPersistentEntity(
      // eslint-disable-next-line isaacscript/strict-enums
      ...getConstituentsFromEntityID(firstNPC as EntityID),
      getRandomAccessiblePosition(Isaac.GetPlayer().Position) ?? VectorZero,
    );

    const instance = {
      npcs: [...input.npcs],
      current: 1,
      index: persistentEntity[1],
      time: GAME_FRAMES_PER_SECOND * 3,
    };

    return this.addInstance(instance);
  }

  override unsubscribe(id: number): void {
    fprint("Unsubscribing from HybridNPCFeature!");

    this.removeInstance(id);
  }

  @Callback(ModCallback.POST_UPDATE)
  postEntityRemove(): void {
    // this.v.run.subscribers.forEach((instance: HybridNPCInstance) => { instance.time--; if
    // (instance.time <= 0) { instance.time = GAME_FRAMES_PER_SECOND * 3; const npc =
    // instance.index; npc.Remove(); const numNPCs = instance.npcs.length; if (numNPCs ===
    // instance.current + 1) { instance.current = -1; } instance.current++; const newNPC =
    // instance.npcs[instance.current]; spawnEntityID(newNPC as EntityID, npc.Position); } });
  }
}
