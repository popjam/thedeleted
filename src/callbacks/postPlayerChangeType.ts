import type { PlayerType } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { postPlayerChangeTypeMode } from "../features/modes/mode";

export function postPlayerChangeTypeInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_CHANGE_TYPE, main); // 35
}

// ModCallback.PRE_PICKUP_COLLISION (35)
function main(
  player: EntityPlayer,
  oldCharacter: PlayerType,
  newCharacter: PlayerType,
) {
  postPlayerChangeTypeMode(player, oldCharacter, newCharacter);
}
