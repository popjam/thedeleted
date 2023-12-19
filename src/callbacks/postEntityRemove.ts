import type { ModUpgraded } from "isaacscript-common";
import {
  CallbackPriority,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { fprint } from "../helper/printHelper";
import { npcIndexPostPlayerRemoveLate } from "../features/general/NPCIndex";

export function postEntityRemoveInit(mod: ModUpgraded): void {
  mod.AddPriorityCallback(
    ModCallback.POST_ENTITY_REMOVE,
    CallbackPriority.LATE,
    lateMain,
    EntityType.PLAYER,
  );
  mod.AddCallback(ModCallback.POST_ENTITY_REMOVE, main);
}

function lateMain(entity: Entity) {
  fprint("POST_ENTITY_REMOVE_LATE_PLAYER");
  npcIndexPostPlayerRemoveLate(entity as EntityPlayer);
}

function main(entity: Entity) {
  if (entity.Type === EntityType.PLAYER) {
    fprint("POST_ENTITY_REMOVE_PLAYER");
    return;
  }
  fprint("POST_ENTITY_REMOVE");
}
