import type { NPCID } from "../../../enums/general/ID/NPCID";

const NPC_NAME_MAP: ReadonlyMap<NPCID, string> = new Map([]);

/**
 * Get an NPC's name from their NPCID.
 *
 * @example NPCID.ARMY_FLY = "Army Fly".
 */
export function getNPCNameFromNPCID(npcID: NPCID): string | undefined {
  const name = NPC_NAME_MAP.get(npcID);
  return name;
}
