import type { Mods } from "../../enums/compatibility/Mods";

const MODDED_ENTITY_ID_TO_MOD_MAP = new Map<string, Mods>([]);

/** Map the modded EntityID to its mod. */
export function _addModdedEntityIDToModMap(entityID: string, mod: Mods): void {
  MODDED_ENTITY_ID_TO_MOD_MAP.set(entityID, mod);
}

/** Get the mod that the modded EntityID is from. */
export function getModFromModdedEntityID(entityID: string): Mods | undefined {
  return MODDED_ENTITY_ID_TO_MOD_MAP.get(entityID);
}

export function _clearModdedEntityIDToModMap(): void {
  MODDED_ENTITY_ID_TO_MOD_MAP.clear();
}
