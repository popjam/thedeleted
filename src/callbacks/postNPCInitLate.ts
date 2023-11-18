import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";

export function postNPCInitLateInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE, main);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function main(_npc: EntityNPC) {}
