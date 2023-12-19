import { ModCallback } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { fprint } from "../helper/printHelper";

export function postPlayerInitInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {
  fprint("POST_PLAYER_INIT");
}
