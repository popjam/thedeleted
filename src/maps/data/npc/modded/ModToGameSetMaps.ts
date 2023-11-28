import type { NPCID } from "isaac-typescript-definitions";
import { Mods } from "../../../../enums/compatibility/Mods";
import { getGameFiendFolioNPCIDSet } from "../../../../sets/data/npc/NPCIDSets";
import { ReadonlyMap } from "isaacscript-common";

const MOD_TO_NPCID_SET_MAP = new ReadonlyMap<Mods, () => Set<NPCID>>([
  [Mods.FIEND_FOLIO, () => getGameFiendFolioNPCIDSet()],
]);

/**
 * Gets the set of all NPCID's for a specific mod (provided the mod is tracked). If it is not,
 * undefined is returned.
 */
export function getGameNPCIDSetForMod(mod: Mods): Set<NPCID> | undefined {
  return MOD_TO_NPCID_SET_MAP.get(mod)?.();
}
