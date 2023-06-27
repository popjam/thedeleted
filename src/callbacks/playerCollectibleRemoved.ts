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
  fprint(
    `

    O------O START POST_PLAYER_COLLECTIBLE_REMOVED O------O
    Collectible removed: ${getCollectibleName(collectibleType)}
    Passive: ${isZazzinatorPassive(collectibleType)}
    Active: ${isZazzinatorActive(collectibleType)}
    O------O END POST_PLAYER_COLLECTIBLE_REMOVED O------O

    `,
  );
  if (isZazzinatorPassive(collectibleType)) {
    invertedItemEffectsPostZazzPassiveCollectibleRemoved(
      player,
      collectibleType,
    );
  } else if (isZazzinatorActive(collectibleType)) {
    invertedItemEffectsPostZazzActiveCollectibleRemoved(player);
  }
}
