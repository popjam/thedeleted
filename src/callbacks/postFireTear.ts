import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";

export function postFireTearInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_FIRE_TEAR, main);
}

function main(tear: EntityTear) {}
