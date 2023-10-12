import type { CollectibleType } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { getCollectibleName, ModCallbackCustom } from "isaacscript-common";
import {
  invertedItemEffectsPostZazzActiveCollectibleRemoved,
  invertedItemEffectsPostZazzPassiveCollectibleRemoved,
} from "../features/corruption/effects/callbacks/postZazzRemoved";
import { fprint } from "../helper/printHelper";
import { isZazzinatorActive, isZazzinatorPassive } from "../sets/zazzSets";

export function postPlayerCollectibleRemovedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_COLLECTIBLE_REMOVED,
    mainZazzRemoved,
  );
}

function mainZazzRemoved(
  player: EntityPlayer,
  collectibleType: CollectibleType,
) {
  if (isZazzinatorPassive(collectibleType)) {
    invertedItemEffectsPostZazzPassiveCollectibleRemoved(
      player,
      collectibleType,
    );
  } else if (isZazzinatorActive(collectibleType)) {
    invertedItemEffectsPostZazzActiveCollectibleRemoved(player);
  }
}
