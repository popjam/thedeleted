// TODO: Get funny item name. Arguments (0-5) CollectibleType / TrinketType.

import type {
  CollectibleType,
  NPCID,
  TrinketType,
} from "isaac-typescript-definitions";
import { getEntityNameFromEntityID } from "../entityHelper/entityIDHelper";
import type { EntityID } from "isaacscript-common";
import { combineManyWords } from "../stringHelper";

// TODO: Get funny description. Arguments (0-5) CollectibleType / TrinketType.

export function getCorruptedName(
  collectibleOrTrinket: Array<CollectibleType | TrinketType>,
): string {
  return "hi";
}

/**
 * Generates a hybrid NPC name based on the given involved NPCs.
 *
 * @param involvedNPCs An array of NPC IDs.
 * @returns The generated hybrid NPC name.
 */
export function getHybridNPCName(involvedNPCs: readonly NPCID[]): string {
  const npcNames = involvedNPCs.map(
    (npc) => getEntityNameFromEntityID(npc as EntityID) ?? "unknown",
  );

  return combineManyWords(...npcNames);
}
