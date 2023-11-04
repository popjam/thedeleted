import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom, getRandomEnumValue } from "isaacscript-common";
import { getNPCFamily } from "../helper/entityHelper/npcHelper";
import {
  isHybridNPC,
  spawnHybridNPC,
} from "../classes/facets/entityModifiers.ts/NPCModifiers/HybridNPCFacet";
import { getEntityIDFromEntity } from "../helper/entityHelper";
import { NPCID } from "../enums/general/ID/NPCID";
import { mod } from "../mod";

export function postNPCInitLateInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE, main);
}

function main(npc: EntityNPC) {}
