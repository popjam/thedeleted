/**
 * This file aids in giving players temporary or permanent 'invisible' collectibles and trinkets
 * using the TemporaryEffects class.
 */

import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import { PlayerIndex } from "isaacscript-common";

const v = {
  level: {
    temporaryCollectibles: new Map<PlayerIndex, CollectibleType>(),
    temporaryTrinkets: new Map<PlayerIndex, TrinketType>(),
  },
  room: {
    temporaryCollectibles: new Map<PlayerIndex, CollectibleType>(),
    temporaryTrinkets: new Map<PlayerIndex, TrinketType>(),
  },
};
