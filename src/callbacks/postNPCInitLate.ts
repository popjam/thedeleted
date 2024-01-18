import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { CallbackPriority } from "isaac-typescript-definitions";

export function postNPCInitLateInit(mod: ModUpgraded): void {
  mod.AddPriorityCallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    CallbackPriority.EARLY,
    main,
  );
}

function main(npc: EntityNPC) {}
