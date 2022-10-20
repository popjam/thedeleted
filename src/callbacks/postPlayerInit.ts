import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";

export function postPlayerInitInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {}
