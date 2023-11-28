import type { NPCID } from "isaac-typescript-definitions";
import { getEnumValues } from "isaacscript-common";

/** This set holds EntityIDs for all non-modded NPCs in the game. */
const gameNonModdedNPCIDSet = new Set<NPCID>();

/** This set holds EntityIDs for all non-modded and modded NPCs in the game. */
const gameNPCIDSet = new Set<NPCID>();

/**
 * This set holds EntityIDs for all modded NPCs in the game. Modded NPCs will be populated when a
 * new game starts.
 */
const moddedNPCIDSet = new Set<NPCID>();

const fiendFolioNPCIDSet = new Set<NPCID>();

/** Retrieve a set containing all non-modded NPCs in the game. */
export function getNonModdedNPCIDSet(): Set<NPCID> {
  return gameNonModdedNPCIDSet;
}

/** Retrieve a set consisting of all tracked modded and non-modded NPCs in the game. */
export function getNPCIDSet(): Set<NPCID> {
  return gameNPCIDSet;
}

/** Retrieve a set consisting of all tracked modded NPCs in the game. */
export function getModdedNPCIDSet(): Set<NPCID> {
  return moddedNPCIDSet;
}

export function getGameFiendFolioNPCIDSet(): Set<NPCID> {
  return fiendFolioNPCIDSet;
}
