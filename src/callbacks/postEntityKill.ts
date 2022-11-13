import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { triggerOnKillActions } from "../classes/corruption/actions/OnKillAction";

export function postEntityKillInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_ENTITY_KILL, main);
}

function main(entity: Entity) {
  triggerOnKillActions(entity);
}
