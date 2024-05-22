import type { ModUpgraded } from "isaacscript-common";
import { CallbackPriority, ModCallback } from "isaac-typescript-definitions";
import { lateSavePostEntityRemoveLate } from "../features/general/lateSave";

export function postEntityRemoveInit(mod: ModUpgraded): void {
  mod.AddPriorityCallback(
    ModCallback.POST_ENTITY_REMOVE,
    CallbackPriority.LATE,
    lateMain,
  );
  mod.AddCallback(ModCallback.POST_ENTITY_REMOVE, main);
}

function lateMain(entity: Entity) {
  // Should not use this callback for anything other than lateSavePostEntityRemoveLate.
  lateSavePostEntityRemoveLate(entity);
}

function main(entity: Entity) {}
