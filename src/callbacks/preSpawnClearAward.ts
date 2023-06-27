import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";

// Add new callback for every use case, unless order is needed.
export function preSpawnClearAwardInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.PRE_SPAWN_CLEAR_AWARD, mainPreSpawnClearAward);
}

function mainPreSpawnClearAward(
  rng: RNG,
  spawnPosition: Vector,
): boolean | undefined {
  return undefined;
}
