import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { postCorruptBombUpdate } from "../features/corruption/inventory/bombInventory";

// Add new callback for every use case, unless order is needed.
export function postBombExplodedInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_BOMB_UPDATE, mainCorruptBomb);
}

function mainCorruptBomb(bomb: EntityBomb) {
  postCorruptBombUpdate(bomb);
}
