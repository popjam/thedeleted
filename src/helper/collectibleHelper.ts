import {
  ActiveSlot,
  CollectibleType,
  ItemPoolType,
  ItemType,
} from "isaac-typescript-definitions";
import {
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
} from "isaacscript-common";
import { TemporaryEffectType } from "../enums/general/TemporaryEffectType";
import { playerAddTemporaryCollectible } from "../features/general/temporaryItems";
import { CollectibleAttribute } from "../interfaces/general/CollectibleAttribute";
import { mod } from "../mod";
import { isInArrayOrEquals } from "./arrayHelper";
import {
  bitFlagsContainsAllBitflags,
  bitFlagsContainsAtLeastOneBitflags,
} from "./bitflagHelper";

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
 * Returns a random CollectibleType following the properties defined in the CollectibleAttribute
 * object.
 */
export function getRandomCollectibleType(
  collectibleAttributes: CollectibleAttribute,
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
