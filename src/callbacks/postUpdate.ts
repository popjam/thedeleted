import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";

export function postUpdateInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {}
