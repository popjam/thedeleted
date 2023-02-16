import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { bombInventoryPostBombExploded } from "../features/corruption/inventory/bombInventory";

// Add new callback for every use case, unless order is needed.
export function postBombExplodedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED, mainCorruptBomb);
}

function mainCorruptBomb(bomb: EntityBomb) {
  bombInventoryPostBombExploded(bomb);
}
