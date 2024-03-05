import type { CollectibleType } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";

export function postPlayerCollectibleAddedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_COLLECTIBLE_ADDED, main);
}

function main(player: EntityPlayer, collectibleType: CollectibleType) {}
