import { ModCallbackCustom } from "isaacscript-common";
import type { ModUpgraded, PlayerStat } from "isaacscript-common";
import { triggerOnStatActions } from "../classes/corruption/actions/OnStatAction";

export function postPlayerStatChangedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_CHANGE_STAT, main);
}

function main<T extends PlayerStat>(
  player: EntityPlayer,
  statType: T,
  difference: int,
) {
  triggerOnStatActions(player, statType, difference);
}
