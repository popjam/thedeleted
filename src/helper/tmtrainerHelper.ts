import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { getCollectibleItemType } from "isaacscript-common";
import { mod } from "../mod";

/** No of TMTRAINER items to spawn when searching for an Active TMTRAINER item. */
const TMTRAINER_FIND_ACTIVE_ITEM_LIMIT = 200;

/**
 * Returns a random TMTRAINER CollectibleType. This is done by temporarily giving the player
 * TMTRAINER, and spawning collectibles, giving them to the player then removing them.
 */
export function getRandomTMTRAINERItem(
  player: EntityPlayer,
): EntityPickupCollectible {
  const hasTMTRAINER = player.HasCollectible(CollectibleType.TMTRAINER);
  if (!hasTMTRAINER) {
    player.AddCollectible(CollectibleType.TMTRAINER, 0, false);
  }

  const tmtCollectible = mod.spawnCollectible(
    CollectibleType.SAD_ONION,
    Vector(0, 0),
  );
  tmtCollectible.Remove();

  if (!hasTMTRAINER) {
    player.RemoveCollectible(CollectibleType.TMTRAINER);
  }

  return tmtCollectible;
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
