import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";

export function postNPCInitLateInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE, main);
}

function main(npc: EntityNPC) {}
