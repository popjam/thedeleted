import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { mainPCPostPlayerInitFirst } from "../features/pc/mainPC";

export function postPlayerInitFirstInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, main);
}

function main(player: EntityPlayer) {
  mainPCPostPlayerInitFirst(player);
  // happy99ModeInit(player);
}
