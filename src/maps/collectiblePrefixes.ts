import { CollectibleType } from "isaac-typescript-definitions";

const COLLECTIBLE_PREFIX_MAP: ReadonlyMap<CollectibleType, string[]> = new Map([
  [CollectibleType.ABADDON, ["Aba", "Abaddo"]],
  [CollectibleType.ABEL, ["Abe", "Ab"]],
  [CollectibleType.ABYSS, ["Aby", "Ab"]],
  [CollectibleType.ACID_BABY, ["Acid ", "Aci", "Acid Ba"]],
  [
    CollectibleType.ACT_OF_CONTRITION,
    ["Act of ", "Act of co", "Act of contri"],
  ],
]);

const COLLECTIBLE_SUFFIX_MAP: ReadonlyMap<CollectibleType, string[]> = new Map([
  [CollectibleType.ABADDON, ["ddon", "don"]],
  [CollectibleType.ABEL, ["bel", "abel"]],
  [CollectibleType.ABYSS, ["yss", "ss", "byss"]],
  [CollectibleType.ACID_BABY, [" Baby", "by", "baby"]],
  [CollectibleType.ACT_OF_CONTRITION, ["ntrition", "trition", "rition"]],
]);
