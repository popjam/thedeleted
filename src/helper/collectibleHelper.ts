import {
  ActiveSlot,
  CollectibleType,
  ItemPoolType,
  ItemType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  game,
  getCollectibleChargeType,
  getCollectibleItemType,
  getCollectibleMaxCharges,
  getCollectibleName,
  getCollectibleQuality,
  getCollectibleTags,
  getPlayerIndex,
  getPlayersWithCollectible,
  getRandomArrayElement,
  getRoomItemPoolType,
  setCollectibleGlitched,
  setCollectibleSubType,
  VectorZero,
} from "isaacscript-common";
import { SHOP_ITEM_RENDER_OFFSET } from "../constants/renderConstants";
import { TemporaryEffectType } from "../enums/general/TemporaryEffectType";
import { playerAddTemporaryCollectible } from "../features/general/temporaryItems";
import { CollectibleAttribute } from "../interfaces/general/CollectibleAttribute";
import { mod } from "../mod";
import { randomInRange, Range } from "../types/general/Range";
import { isInArrayOrEquals } from "./arrayHelper";
import {
  bitFlagsContainsAllBitflags,
  bitFlagsContainsAtLeastOneBitflags,
} from "./bitflagHelper";
import { isCollectibleFree } from "./priceHelper";
import { worldToRenderPosition } from "./renderHelper";
import { copySprite } from "./spriteHelper";

/**
 * Add a collectible to the player. If the collectible is a working collectible effect, add that
 * instead (it reapplies every room). Returns 'true' if it added a collectible effect, and 'false'
 * if it added a collectible.
 */
export function addCollectibleOrEffect(
  player: EntityPlayer,
  collectible: CollectibleType,
): boolean {
  return playerAddTemporaryCollectible(
    player,
    collectible,
    TemporaryEffectType.PERMANENT,
  );
}

/**
 * Returns the offset when rendering an item sprite. For example, shop items are rendered at a
 * different Y coordinate than pedestal items.
 */
export function getCollectibleRenderOffset(
  collectible: EntityPickupCollectible,
): Vector {
  if (!isCollectibleFree(collectible)) {
    return SHOP_ITEM_RENDER_OFFSET;
  }

  return VectorZero;
}

export function getRandomTrinketType(): TrinketType {
  const trinketArray = mod.getTrinketArray();
  return getRandomArrayElement(trinketArray);
}

/** Get a random amount of random collectibles. */
export function getRandomAssortmentOfCollectibles(
  range: Range = [1, 5],
  collectibleAttributes: CollectibleAttribute = {},
): CollectibleType[] {
  const amount = randomInRange(range);
  const collectibles: CollectibleType[] = [];
  for (let i = 0; i < amount; i++) {
    collectibles.push(
      getRandomCollectibleType(collectibleAttributes) ??
        CollectibleType.SAD_ONION,
    );
  }
  return collectibles;
}

/**
 * Makes a Pedestal's Collectible sprite invisible, while still being able to be picked up. Use this
 * instead of 'clearSprite()' as this does not replace the spritesheet, allowing TMTRAINER sprites
 * to not disappear. This function should only be called in the 'PostRender' callback!
 */
export function makeCollectibleInvisible(
  pedestal: EntityPickupCollectible,
): void {
  const copiedSprite = copySprite(pedestal.GetSprite());
  pedestal.GetSprite().Color = Color(0, 0, 0, 0);
  copiedSprite.Play("Alternates", true);
  copiedSprite.Render(worldToRenderPosition(pedestal.Position));
}

/** Spawns a TMTRAINER item. */
export function spawnGlitchedCollectible(
  positionOrGridIndex: Vector,
): EntityPickupCollectible {
  const glitchedCollectible = mod.spawnCollectible(
    CollectibleType.SAD_ONION,
    positionOrGridIndex,
  );
  setCollectibleGlitched(glitchedCollectible);
  return glitchedCollectible;
}

/** Reroll a pedestal from the ItemPool its Collectible is from. */
export function rerollCollectible(
  collectible: EntityPickupCollectible,
): EntityPickupCollectible {
  const collectiblePoolType = mod.getCollectibleItemPoolType(collectible);
  const newCollectibleType = game
    .GetItemPool()
    .GetCollectible(
      collectiblePoolType,
      undefined,
      undefined,
      getRandomCollectibleType({}) ?? CollectibleType.POOP,
    );
  setCollectibleSubType(collectible, newCollectibleType);
  return collectible;
}

/**
 * Returns a random CollectibleType following the properties defined in the CollectibleAttribute
 * object.
 */
export function getRandomCollectibleType(
  collectibleAttributes: CollectibleAttribute = {},
): CollectibleType | undefined {
  const filteredCollectibles: CollectibleType[] = [];
  mod.getCollectibleArray().forEach((currentCollectible) => {
    // Item Type.
    const { itemType } = collectibleAttributes;
    if (itemType !== undefined) {
      if (
        !isInArrayOrEquals<ItemType>(
          getCollectibleItemType(currentCollectible),
          itemType,
        )
      ) {
        return;
      }
    }
    // Pool Type.
    /** Needs fixing. */
    const { poolType } = collectibleAttributes;
    if (poolType !== undefined) {
      const currentCollectiblePoolType = ItemPoolType.ANGEL;
      if ((poolType as string) === "room") {
        if (getRoomItemPoolType() !== currentCollectiblePoolType) {
          return;
        }
      } else if (!isInArrayOrEquals(currentCollectiblePoolType, poolType)) {
        return;
      }
    }

    // Item quality.
    const { quality } = collectibleAttributes;
    if (quality !== undefined) {
      if (
        !isInArrayOrEquals<number>(
          getCollectibleQuality(currentCollectible),
          quality,
        )
      ) {
        return;
      }
    }

    // Charge type (passive collectibles return 'normal').
    const { chargeType } = collectibleAttributes;
    if (chargeType !== undefined) {
      if (
        !isInArrayOrEquals(
          getCollectibleChargeType(currentCollectible),
          chargeType,
        )
      ) {
        return;
      }
    }

    // Max charges (passive collectibles return '0').
    const { maxCharges } = collectibleAttributes;
    if (maxCharges !== undefined) {
      if (
        !isInArrayOrEquals(
          getCollectibleMaxCharges(currentCollectible),
          maxCharges,
        )
      ) {
        return;
      }
    }

    // Player has.
    const { playerHas } = collectibleAttributes;
    if (playerHas !== undefined) {
      const doSomeHave = getPlayersWithCollectible(currentCollectible).some(
        (player) => {
          // Prevent it including player pocket items.
          if (player.GetActiveItem(ActiveSlot.POCKET) === currentCollectible) {
            return;
          }
          const playerIndex = getPlayerIndex(player);
          return isInArrayOrEquals(playerIndex, playerHas);
        },
      );
      if (!doSomeHave) {
        return;
      }
    }

    // Starts with (capitalization doesn't matter).
    const { startsWith } = collectibleAttributes;
    if (startsWith !== undefined) {
      const lcCurrentCollectibleName =
        getCollectibleName(currentCollectible).toLowerCase();
      const lcStartsWith = startsWith.toLowerCase();
      if (!lcCurrentCollectibleName.startsWith(lcStartsWith)) {
        return;
      }
    }

    // Starts with (capitalization doesn't matter).
    const { endsWith } = collectibleAttributes;
    if (endsWith !== undefined) {
      const lcCurrentCollectibleName =
        getCollectibleName(currentCollectible).toLowerCase();
      const lcEndsWith = endsWith.toLowerCase();
      if (!lcCurrentCollectibleName.endsWith(lcEndsWith)) {
        return;
      }
    }

    // Item tags (contains ALL).
    const { itemTagAll } = collectibleAttributes;
    if (itemTagAll !== undefined) {
      const currentCollectibleTags = getCollectibleTags(currentCollectible);
      if (!bitFlagsContainsAllBitflags(currentCollectibleTags, itemTagAll)) {
        return;
      }
    }

    // Item tags (contains AT LEAST ONE).
    const { itemTagOne } = collectibleAttributes;
    if (itemTagOne !== undefined) {
      const currentCollectibleTags = getCollectibleTags(currentCollectible);
      if (
        !bitFlagsContainsAtLeastOneBitflags(currentCollectibleTags, itemTagOne)
      ) {
        return;
      }
    }

    // Banned Collectibles.
    const { banned } = collectibleAttributes;
    if (banned !== undefined) {
      if (banned.includes(currentCollectible)) {
        return;
      }
    }

    filteredCollectibles.push(currentCollectible);
  });
  if (filteredCollectibles.length === 0) {
    return undefined;
  }
  return getRandomArrayElement(filteredCollectibles);
}
