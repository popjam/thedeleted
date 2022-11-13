import { CollectibleType } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";

export function postPlayerCollectibleAddedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_COLLECTIBLE_ADDED, main);
}

function main(player: EntityPlayer, collectibleType: CollectibleType) {}
