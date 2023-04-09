import {
  ActiveSlot,
  CollectibleType,
  ItemPoolType,
  ItemType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  VectorZero,
  arrayRemove,
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
  getRandomSeed,
  getRoomItemPoolType,
  isRNG,
  newRNG,
  setCollectibleGlitched,
  setCollectibleSubType,
} from "isaacscript-common";
import { SHOP_ITEM_RENDER_OFFSET } from "../constants/renderConstants";
import { TemporaryEffectType } from "../enums/general/TemporaryEffectType";
import { playerAddTemporaryCollectible } from "../features/general/temporaryItems";
import { CollectibleAttribute } from "../interfaces/general/CollectibleAttribute";
import { mod } from "../mod";
import { Range, randomInRange } from "../types/general/Range";
import { isInArrayOrEquals } from "./arrayHelper";
import {
  bitFlagsContainsAllBitflags,
  bitFlagsContainsAtLeastOneBitflags,
} from "./bitflagHelper";
import { isCollectibleFree } from "./priceHelper";
import { fprint } from "./printHelper";
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
  collectibleAttributes: CollectibleAttribute | undefined = undefined,
  seedOrRNG: Seed | RNG = getRandomSeed(),
): CollectibleType[] {
  const rng = isRNG(seedOrRNG) ? seedOrRNG : newRNG(seedOrRNG);
  const amount = randomInRange(range, rng);
  const collectibles: CollectibleType[] = [];
  for (let i = 0; i < amount; i++) {
    collectibles.push(
      getRandomCollectibleType(collectibleAttributes, rng) ??
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
export function renderCollectibleInvisible(
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
 * Checks if a specified CollectibleType matches all attributes set through the CollectibleAttribute
 * object.
 */
export function doesCollectibleTypeMatchAttributes(
  collectibleType: CollectibleType,
  collectibleAttributes: CollectibleAttribute,
): boolean {
  // Item Type.
  const { itemType } = collectibleAttributes;
  if (itemType !== undefined) {
    if (
      !isInArrayOrEquals<ItemType>(
        getCollectibleItemType(collectibleType),
        itemType,
      )
    ) {
      return false;
    }
  }

  // Pool Type.
  /** Needs fixing. */
  const { poolType } = collectibleAttributes;
  if (poolType !== undefined) {
    const currentCollectiblePoolType = ItemPoolType.ANGEL;
    if ((poolType as string) === "room") {
      if (getRoomItemPoolType() !== currentCollectiblePoolType) {
        return false;
      }
    } else if (!isInArrayOrEquals(currentCollectiblePoolType, poolType)) {
      return false;
    }
  }

  // Item quality.
  const { quality } = collectibleAttributes;
  if (quality !== undefined) {
    if (
      !isInArrayOrEquals<number>(
        getCollectibleQuality(collectibleType),
        quality,
      )
    ) {
      return false;
    }
  }

  // Charge type (passive collectibles return 'normal').
  const { chargeType } = collectibleAttributes;
  if (chargeType !== undefined) {
    if (
      !isInArrayOrEquals(getCollectibleChargeType(collectibleType), chargeType)
    ) {
      return false;
    }
  }

  // Max charges (passive collectibles return '0').
  const { maxCharges } = collectibleAttributes;
  if (maxCharges !== undefined) {
    if (
      !isInArrayOrEquals(getCollectibleMaxCharges(collectibleType), maxCharges)
    ) {
      return false;
    }
  }

  // Player has.
  const { playerHas } = collectibleAttributes;
  if (playerHas !== undefined) {
    const doSomeHave = getPlayersWithCollectible(collectibleType).some(
      (player) => {
        // Prevent it including player pocket items.
        if (player.GetActiveItem(ActiveSlot.POCKET) === collectibleType) {
          return false;
        }
        const playerIndex = getPlayerIndex(player);
        return isInArrayOrEquals(playerIndex, playerHas);
      },
    );
    if (!doSomeHave) {
      return false;
    }
  }

  // Starts with (capitalization doesn't matter).
  const { startsWith } = collectibleAttributes;
  if (startsWith !== undefined) {
    const lcCurrentCollectibleName =
      getCollectibleName(collectibleType).toLowerCase();
    const lcStartsWith = startsWith.toLowerCase();
    if (!lcCurrentCollectibleName.startsWith(lcStartsWith)) {
      return false;
    }
  }

  // Starts with (capitalization doesn't matter).
  const { endsWith } = collectibleAttributes;
  if (endsWith !== undefined) {
    const lcCurrentCollectibleName =
      getCollectibleName(collectibleType).toLowerCase();
    const lcEndsWith = endsWith.toLowerCase();
    if (!lcCurrentCollectibleName.endsWith(lcEndsWith)) {
      return false;
    }
  }

  // Item tags (contains ALL).
  const { itemTagAll } = collectibleAttributes;
  if (itemTagAll !== undefined) {
    const currentCollectibleTags = getCollectibleTags(collectibleType);
    if (!bitFlagsContainsAllBitflags(currentCollectibleTags, itemTagAll)) {
      return false;
    }
  }

  // Item tags (contains AT LEAST ONE).
  const { itemTagOne } = collectibleAttributes;
  if (itemTagOne !== undefined) {
    const currentCollectibleTags = getCollectibleTags(collectibleType);
    if (
      !bitFlagsContainsAtLeastOneBitflags(currentCollectibleTags, itemTagOne)
    ) {
      return false;
    }
  }

  // Banned Collectibles.
  const { banned } = collectibleAttributes;
  if (banned !== undefined) {
    if (banned.includes(collectibleType)) {
      return false;
    }
  }

  return true;
}

/**
 * Returns a random CollectibleType following the properties defined in the CollectibleAttribute
 * object.
 */
export function getRandomCollectibleType(
  collectibleAttributes?: CollectibleAttribute,
  seedOrRNG: Seed | RNG = getRandomSeed(),
): CollectibleType | undefined {
  let filteredCollectibles = [...mod.getCollectibleArray()];
  const rng = isRNG(seedOrRNG) ? seedOrRNG : newRNG(seedOrRNG);
  let currentCollectible: CollectibleType | undefined;
  let i = 0;

  while (filteredCollectibles.length > 0) {
    currentCollectible = getRandomArrayElement(filteredCollectibles, rng);
    if (collectibleAttributes === undefined) {
      break;
    }

    filteredCollectibles = arrayRemove(
      filteredCollectibles,
      currentCollectible,
    );
    i++;

    if (
      doesCollectibleTypeMatchAttributes(
        currentCollectible,
        collectibleAttributes,
      )
    ) {
      fprint(
        `Found collectible: ${getCollectibleName(
          currentCollectible,
        )}, with ${i} iterations`,
      );
      break;
    }
  }

  return filteredCollectibles.length === 0 ? undefined : currentCollectible;
}
