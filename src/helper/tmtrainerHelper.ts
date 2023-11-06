import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { getCollectibleItemType } from "isaacscript-common";
import { mod } from "../mod";
import { TMTRAINER_THRESHOLD } from "../constants/tmtrainerConstants";
import { doesInvertedItemHaveActionSet } from "../features/corruption/effects/itemEffects";

/** No of TMTRAINER items to spawn when searching for an Active TMTRAINER item. */
const TMTRAINER_FIND_ACTIVE_ITEM_LIMIT = 200;

/**
 * Returns a random TMTRAINER CollectibleType. This is done by temporarily giving the player
 * TMTRAINER, and spawning a collectible, grabbing the SubType then removing the pedestal.
 */
export function getRandomTMTRAINERItem(): CollectibleType {
  const player = Isaac.GetPlayer();
  const hasTMTRAINER = player.HasCollectible(CollectibleType.TMTRAINER);
  if (!hasTMTRAINER) {
    player.AddCollectible(CollectibleType.TMTRAINER, 0, false);
  }

  const tmtCollectible = mod.spawnCollectible(
    CollectibleType.SAD_ONION,
    Vector(0, 0),
    undefined,
  );
  tmtCollectible.Remove();

  if (!hasTMTRAINER) {
    player.RemoveCollectible(CollectibleType.TMTRAINER);
  }

  return tmtCollectible.SubType;
}

/**
 * Returns a random TMTRAINER CollectibleType, that does not already have an ActionSet attached to
 * it.
 */
export function getRandomUnusedTMTRAINERItem(): CollectibleType {
  let tmtCollectibleType = getRandomTMTRAINERItem();
  for (let i = 0; i < TMTRAINER_FIND_ACTIVE_ITEM_LIMIT; i++) {
    if (!doesInvertedItemHaveActionSet(tmtCollectibleType)) {
      break;
    }
    tmtCollectibleType = getRandomTMTRAINERItem();
  }
  return tmtCollectibleType;
}

/** Returns true if the subType of a Collectible dictates it as a TMTRAINER item. */
export function isGlitchedCollectibleSubType(
  subType: CollectibleType,
): boolean {
  return (subType as number) > TMTRAINER_THRESHOLD;
}

/**
 * Returns a random TMTRAINER active CollectibleType. This is done by temporarily giving the player
 * TMTRAINER, and spawning collectibles until an active item is found, giving them to the player
 * then removing them.
 */
export function getRandomTMTRAINERActiveItem(): CollectibleType {
  const player = Isaac.GetPlayer();

  const hasTMTRAINER = player.HasCollectible(CollectibleType.TMTRAINER);
  if (!hasTMTRAINER) {
    player.AddCollectible(CollectibleType.TMTRAINER, 0, false);
  }

  let activeItemType = CollectibleType.POOP;

  for (let i = 0; i < TMTRAINER_FIND_ACTIVE_ITEM_LIMIT; i++) {
    const tmtCollectible = mod.spawnCollectible(
      CollectibleType.SAD_ONION,
      Vector(0, 0),
      undefined,
    );
    const tmtCollectibleType = tmtCollectible.SubType;
    tmtCollectible.Remove();
    if (getCollectibleItemType(tmtCollectibleType) === ItemType.ACTIVE) {
      activeItemType = tmtCollectibleType;
      break;
    }
  }

  if (!hasTMTRAINER) {
    player.RemoveCollectible(CollectibleType.TMTRAINER);
  }

  return activeItemType;
}
