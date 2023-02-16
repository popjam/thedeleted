import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { postCorruptBombInitLate } from "../features/corruption/inventory/bombInventory";

// Add new callback for every use case, unless order is needed.
export function postBombInitLateInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_BOMB_INIT_LATE, mainCorruptBomb);
}

function mainCorruptBomb(bomb: EntityBomb) {
  postCorruptBombInitLate(bomb);
}
