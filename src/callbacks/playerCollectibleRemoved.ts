import { CollectibleType } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";

export function postPlayerCollectibleRemovedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_COLLECTIBLE_REMOVED,
    main,
  );
}

function main(player: EntityPlayer, collectibleType: CollectibleType) {}
