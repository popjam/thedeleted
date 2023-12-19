import { ModCallback } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { fprint } from "../helper/printHelper";
import { printPersistentNPCs } from "../features/general/NPCIndex";

export function postNPCUpdateInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.PRE_NPC_UPDATE, main);
}

function main(entity: Entity): boolean | undefined {
  return undefined;
}
