import type { TrinketType, ItemType } from "isaac-typescript-definitions";
import {
  ActiveSlot,
  CollectibleType,
  ItemPoolType,
} from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
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
  getEntityID,
  getPlayerIndex,
  getPlayersWithCollectible,
  getRandomArrayElement,
  getRandomSeed,
  getRoomItemPoolType,
  isHiddenCollectible,
  isRNG,
  newRNG,
  setCollectibleGlitched,
  setCollectibleSubType,
  spawnCollectible,
} from "isaacscript-common";
import { SHOP_ITEM_RENDER_OFFSET } from "../constants/renderConstants";
import { TemporaryEffectType } from "../enums/general/TemporaryEffectType";
import { playerAddTemporaryCollectible } from "../features/general/temporaryItems";
import type { CollectibleAttribute } from "../interfaces/general/CollectibleAttribute";
import { mod } from "../mod";
import type { Range } from "../types/general/Range";
import { randomInRange } from "../types/general/Range";
import { isInArrayOrEquals } from "./arrayHelper";
import {
  bitFlagsContainsAllBitflags,
  bitFlagsContainsAtLeastOneBitflags,
} from "./bitflagHelper";
import { isCollectibleFree } from "./priceHelper";
import { worldToRenderPosition } from "./renderHelper";
import { copySprite } from "./spriteHelper";
import { getItemTypeText } from "../maps/data/name/itemTypeNameMap";
import {
  addTheS,
  joinWith,
  joinWithOr,
  legibleString,
  removeUnnecessaryWhiteSpace,
  uncapitalizeFirstLetter,
} from "./stringHelper";
import { itemPoolTypeToText } from "../maps/data/name/itemPoolTypeNameMap";
import { itemConfigChargeTypeToText } from "../maps/data/name/itemConfigChargeTypeNameMap";
import { getItemConfigTagText } from "../maps/data/name/itemTagNameMap";

/** Replace an active item with another in a specific ActiveSlot. */
export function replaceActiveItem(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
  replaceWith: CollectibleType,
  keepInPoolsIfApplicable = true,
  firstTimePickingUpIfApplicable = true,
): void {
  if (player.GetActiveItem(activeSlot) === CollectibleType.NULL) {
    return;
  }

  if (
    activeSlot === ActiveSlot.POCKET ||
    activeSlot === ActiveSlot.POCKET_SINGLE_USE
  ) {
    player.SetPocketActiveItem(
      replaceWith,
      activeSlot,
      keepInPoolsIfApplicable,
    );
  } else {
    player.RemoveCollectible(
      player.GetActiveItem(activeSlot),
      true,
      activeSlot,
    );
    player.AddCollectible(
      replaceWith,
      0,
      firstTimePickingUpIfApplicable,
      activeSlot,
    );
  }
}

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
  const trinketArray = mod.getTrinketTypes();
  return getRandomArrayElement(trinketArray, getRandomSeed());
}

/** Get a random amount of random collectibles. */
export function getRandomAssortmentOfCollectibles(
  range: Range = [1, 5],
  collectibleAttributes: CollectibleAttribute | undefined = undefined,
  seedOrRNG: Seed | RNG = getRandomSeed(),
): readonly CollectibleType[] {
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
  const glitchedCollectible = spawnCollectible(
    CollectibleType.SAD_ONION,
    positionOrGridIndex,
    undefined,
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

  // Forced.
  const { forced } = collectibleAttributes;
  if (forced !== undefined && forced.includes(collectibleType)) {
    return true;
  }

  // Item Type.
  if (
    itemType !== undefined &&
    !isInArrayOrEquals<ItemType>(
      getCollectibleItemType(collectibleType),
      itemType,
    )
  ) {
    return false;
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
  if (
    quality !== undefined &&
    !isInArrayOrEquals<number>(getCollectibleQuality(collectibleType), quality)
  ) {
    return false;
  }

  // Charge type (passive collectibles return 'normal').
  const { chargeType } = collectibleAttributes;
  if (
    chargeType !== undefined &&
    !isInArrayOrEquals(getCollectibleChargeType(collectibleType), chargeType)
  ) {
    return false;
  }

  // Max charges (passive collectibles return '0').
  const { maxCharges } = collectibleAttributes;
  if (
    maxCharges !== undefined &&
    !isInArrayOrEquals(getCollectibleMaxCharges(collectibleType), maxCharges)
  ) {
    return false;
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
        return true;
      },
    );
    if (playerHas !== doSomeHave) {
      return false;
    }
    return true;
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
  if (banned !== undefined && banned.includes(collectibleType)) {
    return false;
  }

  // Hidden.
  const { hidden } = collectibleAttributes;
  if (
    (hidden === undefined || !hidden) &&
    isHiddenCollectible(collectibleType)
  ) {
    return false;
  }

  return true;
}

/**
 * Returns a random CollectibleType following the properties defined in the CollectibleAttribute
 * object.
 *
 * @param collectibleAttributes The CollectibleAttribute object to follow, or undefined for a random
 *                              CollectibleType.
 * @param seedOrRNG The seed or RNG to use.
 * @param collectibleArray The array of CollectibleTypes to choose from, or undefined for all
 *                         CollectibleTypes (including modded).
 * @returns The CollectibleType, or undefined if no CollectibleType was found.
 */
export function getRandomCollectibleType(
  collectibleAttributes?: CollectibleAttribute,
  seedOrRNG: Seed | RNG = getRandomSeed(),
  collectibleArray:
    | CollectibleType[]
    | readonly CollectibleType[] = mod.getCollectibleTypes(),
): CollectibleType | undefined {
  let filteredCollectibles = [...collectibleArray];
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
      break;
    }
  }

  return filteredCollectibles.length === 0 ? undefined : currentCollectible;
}

/**
 * Convert a CollectibleAttribute object to the appropriate text.
 *
 * @example { quality: 4, itemType: ItemType.ACTIVE } -> "quality 4 active item".
 */
export function collectibleAttributeToText(
  collectibleAttribute: CollectibleAttribute,
  plural = false,
): string {
  let text = plural ? "random " : "a random ";
  const isPluralNum = plural ? 2 : 1;

  // Item Type.
  if (collectibleAttribute.itemType !== undefined) {
    text +=
      typeof collectibleAttribute.itemType === "number"
        ? `${getItemTypeText(collectibleAttribute.itemType)} `
        : `${joinWithOr(
            collectibleAttribute.itemType.flatMap((q) => getItemTypeText(q)),
          )}`;
  }

  // Item.
  text = `${text} ${addTheS("item", isPluralNum)} `;

  // We set up a textArray, so we can join it with 'and' later, and for greater flexibility.
  const textArray = [] as string[];

  // Quality.
  if (collectibleAttribute.quality !== undefined) {
    textArray.push(
      typeof collectibleAttribute.quality === "number"
        ? `of quality ${collectibleAttribute.quality}`
        : `of quality ${joinWithOr(
            collectibleAttribute.quality.flatMap((q) => tostring(q)),
          )}`,
    );
  }

  // PoolType.
  if (collectibleAttribute.poolType !== undefined) {
    if (collectibleAttribute.poolType === "room") {
      textArray.push(" from the current room pool ");
    } else if (typeof collectibleAttribute.poolType === "number") {
      textArray.push(
        `from the ${itemPoolTypeToText(collectibleAttribute.poolType)} pool`,
      );
    } else {
      textArray.push(
        `from the ${joinWithOr(
          collectibleAttribute.poolType.flatMap((q) => itemPoolTypeToText(q)),
        )} pool`,
      );
    }
  }

  // ChargeType.
  if (collectibleAttribute.chargeType !== undefined) {
    textArray.push(
      typeof collectibleAttribute.chargeType === "number"
        ? `with has a '${itemConfigChargeTypeToText(
            collectibleAttribute.chargeType,
          )} charge'`
        : `with a ${joinWithOr(
            collectibleAttribute.chargeType.flatMap(
              (q) => `${itemConfigChargeTypeToText(q)}`,
            ),
          )} charge`,
    );
  }

  // MaxCharges
  if (collectibleAttribute.maxCharges !== undefined) {
    textArray.push(
      typeof collectibleAttribute.maxCharges === "number"
        ? `which has a charge count of ${collectibleAttribute.maxCharges}`
        : `which has a charge count of ${joinWithOr(
            collectibleAttribute.maxCharges.flatMap((q) => tostring(q)),
          )}`,
    );
  }

  // Owned by player.
  if (collectibleAttribute.playerHas !== undefined) {
    textArray.push(
      collectibleAttribute.playerHas
        ? "that a player already owns"
        : "that a player doesn't already own",
    );
  }

  // Starts with (capitalization doesn't matter).
  if (collectibleAttribute.startsWith !== undefined) {
    textArray.push(
      `that starts with '${collectibleAttribute.startsWith.toUpperCase()}'`,
    );
  }

  // Ends with (capitalization doesn't matter).
  if (collectibleAttribute.endsWith !== undefined) {
    textArray.push(
      `that ends with '${collectibleAttribute.endsWith.toUpperCase()}'`,
    );
  }

  // Item tags (contains ALL).
  if (collectibleAttribute.itemTagAll !== undefined) {
    textArray.push(
      `that ${joinWith(
        "and",
        collectibleAttribute.itemTagAll.flatMap((q) =>
          uncapitalizeFirstLetter(getItemConfigTagText(q)),
        ),
      )}`,
    );
  }

  // Item tags (contains AT LEAST ONE).
  if (collectibleAttribute.itemTagOne !== undefined) {
    textArray.push(
      `that ${joinWith(
        "or",
        collectibleAttribute.itemTagOne.flatMap((q) =>
          uncapitalizeFirstLetter(getItemConfigTagText(q)),
        ),
      )}`,
    );
  }

  // If the textArray is empty or has one element.
  text += ` ${textArray[0]} `;

  // If the textArray has more than one elements.
  if (textArray.length > 1) {
    textArray.shift();
    text += textArray.join(", ");
  }

  return text;
}
