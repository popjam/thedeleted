import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { bombInventoryPostBombExploded } from "../features/corruption/inventory/bombInventory";
import { triggerOnBombExplodeActions } from "../classes/corruption/actions/OnBombExplodeAction";
import { fprint } from "../helper/printHelper";

// Add new callback for every use case, unless order is needed.
export function postBombExplodedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED, main);
}

function main(bomb: EntityBomb) {
  bombInventoryPostBombExploded(bomb);
  triggerOnBombExplodeActions(bomb);
}
