import { CollectibleType } from "isaac-typescript-definitions";

/** Returns the Collectible icon for EID. */
export function getEIDIconFromCollectible(
  collectibleType: CollectibleType,
): string {
  return `{{Collectible${collectibleType}}}`;
}
