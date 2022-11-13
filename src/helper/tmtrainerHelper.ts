import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { getCollectibleItemType } from "isaacscript-common";
import { mod } from "../mod";

/**
 * Returns a random TMTRAINER CollectibleType. This is done by temporarily giving the player
 * TMTRAINER, and spawning collectibles, giving them to the player then removing them.
 */
export function getRandomTMTRAINERItem(player: EntityPlayer): Sprite {
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

  return tmtCollectible.GetSprite();
}

/**
 * Returns a random TMTRAINER active CollectibleType. This is done by temporarily giving the player
 * TMTRAINER, and spawning collectibles, giving them to the player then removing them.
 */
export function getRandomTMTRAINERActiveItem(): CollectibleType {
  const player = Isaac.GetPlayer();

  const hasTMTRAINER = player.HasCollectible(CollectibleType.TMTRAINER);
  if (!hasTMTRAINER) {
    player.AddCollectible(CollectibleType.TMTRAINER, 0, false);
  }

  let activeItemType = CollectibleType.POOP;

  for (let i = 0; i < 100; i++) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepCopy2<T>(target: T): any {
  if (target === null) {
    return target;
  }
  if (typeof target === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cp = { ...(target as Record<string, any>) } as Record<string, any>;
    Object.keys(cp).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      cp[k] = deepCopy2<any>(cp[k]);
    });
    return cp as T;
  }
  return target;
}
