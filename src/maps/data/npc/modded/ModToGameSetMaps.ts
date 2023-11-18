import type { NPCID } from "isaac-typescript-definitions";
import { Mods } from "../../../../enums/compatibility/Mods";
import { getGameFiendFolioNPCIDSet } from "../../../../sets/data/entities/GameNPCIDSets";
import { ReadonlyMap } from "isaacscript-common";

const MOD_TO_NPCID_SET_MAP = new ReadonlyMap<Mods, () => Set<NPCID>>([
  [Mods.FIEND_FOLIO, () => getGameFiendFolioNPCIDSet()],
]);

export function getNPCIDSetForMod(mod: Mods): Set<NPCID> | undefined {
  return MOD_TO_NPCID_SET_MAP.get(mod)?.();
}
