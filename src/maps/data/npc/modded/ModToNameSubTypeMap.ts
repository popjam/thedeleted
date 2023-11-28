import { FiendFolioNPCNameSubTypes } from "../../../../enums/data/ID/modded/fiendFolio/FiendFolioNPCNameSubTypes";
import { Mods } from "../../../../enums/compatibility/Mods";

const MOD_TO_NPC_NAME_SUBTYPE_ENUM_MAP: ReadonlyMap<
  Mods,
  Record<string, string>
> = new Map([[Mods.FIEND_FOLIO, FiendFolioNPCNameSubTypes]]);

/** Obtain the set of name + subType NPC ID's for a tracked mod. */
export function getNPCIDNameSubTypesForMod(mod: Mods): Set<string> | undefined {
  const nameSubTypeEnum = MOD_TO_NPC_NAME_SUBTYPE_ENUM_MAP.get(mod);
  if (nameSubTypeEnum === undefined) {
    return undefined;
  }

  return new Set(Object.values(nameSubTypeEnum));
}
