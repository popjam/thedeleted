import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { triggerOnFloorActions } from "../classes/corruption/actions/OnFloorAction";

export function postNewLevelInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_NEW_LEVEL, main);
}

function main() {
  triggerOnFloorActions();
}
