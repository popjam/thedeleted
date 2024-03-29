import { PlayerVariant } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { PlayerTypeCustom } from "../enums/general/PlayerTypeCustom";
import { happy99PostPlayerFatalDamage } from "../features/modes/HAPPY99/HAPPY99";
import { iloveyouPostPlayerFatalDamage } from "../features/modes/ILOVEYOU/ILOVEYOU";
import { playerInversionPostPlayerFatalDamage } from "../helper/deletedSpecific/inversion/playerInversion";
import { triggerOnDeathActions } from "../classes/corruption/actions/OnDeathAction";

export function postPlayerFatalDamageInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_FATAL_DAMAGE, main);
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_FATAL_DAMAGE,
    happy99,
    PlayerVariant.PLAYER,
    PlayerTypeCustom.DELETED_HAPPY99,
  );
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_FATAL_DAMAGE,
    iloveyou,
    PlayerVariant.PLAYER,
    PlayerTypeCustom.DELETED_ILOVEYOU,
  );
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_FATAL_DAMAGE,
    corruption,
    PlayerVariant.PLAYER,
  );
}

function happy99(player: EntityPlayer): boolean | undefined {
  return happy99PostPlayerFatalDamage(player);
}

function iloveyou(player: EntityPlayer): boolean | undefined {
  return iloveyouPostPlayerFatalDamage(player);
}

function corruption(player: EntityPlayer): boolean | undefined {
  return playerInversionPostPlayerFatalDamage(player);
}

function main(player: EntityPlayer): boolean | undefined {
  triggerOnDeathActions(player);
  return undefined;
}
