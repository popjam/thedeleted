import { PlayerVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { PlayerTypeCustom } from "../enums/general/PlayerTypeCustom";
import { happy99PostPlayerFatalDamage } from "../features/modes/HAPPY99/HAPPY99";
import { iloveyouPostPlayerFatalDamage } from "../features/modes/ILOVEYOU/ILOVEYOU";

export function postPlayerFatalDamageInit(mod: ModUpgraded): void {
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
}

function happy99(player: EntityPlayer): boolean | undefined {
  return happy99PostPlayerFatalDamage(player);
}

function iloveyou(player: EntityPlayer): boolean | undefined {
  return iloveyouPostPlayerFatalDamage(player);
}
