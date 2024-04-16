import { ModCallback } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";

export function postNewRoomInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_NEW_ROOM, main);
}

function main() {}
