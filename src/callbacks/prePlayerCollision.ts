import { ModCallback, PlayerVariant } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { PlayerTypeCustom } from "../enums/general/PlayerTypeCustom";
import { iloveyouPlayerCollision } from "../features/modes/ILOVEYOU/ILOVEYOU";

// Add new callback for every use case, unless order is needed.
export function prePlayerCollisionInit(mod: ModUpgraded): void {
  mod.AddCallback(
    ModCallback.PRE_PLAYER_COLLISION,
    iloveyou,
    PlayerVariant.PLAYER,
  );
}

function iloveyou(player: EntityPlayer, collider: Entity): boolean | undefined {
  if (player.GetPlayerType() !== PlayerTypeCustom.DELETED_ILOVEYOU) {
    return undefined;
  }
  return iloveyouPlayerCollision(player, collider);
}
