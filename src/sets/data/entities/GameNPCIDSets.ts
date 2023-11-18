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

export function getGameNonModdedNPCIDSet(): Set<NPCID> {
  return gameNonModdedNPCIDSet;
}

export function getGameNPCIDSet(): Set<NPCID> {
  return gameNPCIDSet;
}

export function getGameModdedNPCIDSet(): Set<NPCID> {
  return moddedNPCIDSet;
}

export function getGameFiendFolioNPCIDSet(): Set<NPCID> {
  return fiendFolioNPCIDSet;
}
