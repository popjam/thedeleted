import { getRandomSetElement } from "isaacscript-common";
import { getGameFiendFolioNPCIDSet } from "../../../sets/data/entities/GameNPCIDSets";
import type { NPCID } from "isaac-typescript-definitions";

export function isFiendFolioActive(): boolean {
  return FiendFolio !== undefined;
}

export function getRandomFiendFolioNPCID(
  seedOrRNG: Seed | RNG | undefined,
): NPCID | undefined {
  if (!isFiendFolioActive()) {
    return undefined;
  }

  const npcIDs = getGameFiendFolioNPCIDSet();
  return getRandomSetElement(npcIDs, seedOrRNG);
}
