import { CollectibleType } from "isaac-typescript-definitions";
import {
  getCollectibleName,
  ModCallbackCustom,
  ModUpgraded,
} from "isaacscript-common";
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
  fprint(`Collectible removed: ${getCollectibleName(collectibleType)}`);
  if (isZazzinatorPassive(collectibleType)) {
    invertedItemEffectsPostZazzActiveCollectibleRemoved(player);
  } else if (isZazzinatorActive(collectibleType)) {
    invertedItemEffectsPostZazzPassiveCollectibleRemoved(player);
  }
}
