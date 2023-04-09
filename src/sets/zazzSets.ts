import { CollectibleType } from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../enums/general/CollectibleTypeCustom";

/** Set of all passive Zazzinator items. */
export const ZAZZINATOR_PASSIVE_SET: ReadonlySet<CollectibleType> = new Set([
  CollectibleTypeCustom.ZAZZ,
]);

/** Set of all Zazzinator items, passive or active. */
export const ZAZZINATOR_SET: ReadonlySet<CollectibleType> = new Set([
  CollectibleTypeCustom.ZAZZ,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_0,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_0_COPY,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_1,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_2,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_3,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_4,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_5,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_6,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_7,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_8,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_9,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_10,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_11,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_12,
]);

/** Contains all ZAZZ Actives, including copies. */
export const ZAZZINATOR_ACTIVE_SET: ReadonlySet<CollectibleType> = new Set([
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_0,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_0_COPY,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_1,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_2,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_3,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_4,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_5,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_6,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_7,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_8,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_9,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_10,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_11,
  CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_12,
]);

/** Only contains ZAZZ copies. */
export const ZAZZINATOR_ACTIVE_COPY_SET: ReadonlySet<CollectibleType> = new Set(
  [CollectibleTypeCustom.ZAZZ_ACTIVE_NORMAL_0_COPY],
);

/** Checks if collectibleType is a ZAZZ active copy. */
export function isZazzinatorActiveCopy(collectible: CollectibleType): boolean {
  return ZAZZINATOR_ACTIVE_COPY_SET.has(collectible);
}

/** Checks if a collectibleType is a ZAZZ active. */
export function isZazzinatorActive(collectible: CollectibleType): boolean {
  return ZAZZINATOR_ACTIVE_SET.has(collectible);
}

/** Checks if a collectibleType is a ZAZZ. */
export function isZazzinatorAny(collectible: CollectibleType): boolean {
  return ZAZZINATOR_SET.has(collectible);
}

/** Checks if a collectibleType is a ZAZZ passive. */
export function isZazzinatorPassive(collectible: CollectibleType): boolean {
  return ZAZZINATOR_PASSIVE_SET.has(collectible);
}
