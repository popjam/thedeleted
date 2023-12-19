import type { EntityID } from "isaacscript-common";
import type { Mods } from "../../enums/compatibility/Mods";

const moddedEntityIDToModMap = new Map<EntityID, Mods>([]);

/** Map the modded EntityID to its mod. */
export function _addModdedEntityIDToModMap(
  entityID: EntityID,
  mod: Mods,
): void {
  moddedEntityIDToModMap.set(entityID, mod);
}

/** Get the mod that the modded EntityID is from. */
export function getModFromModdedEntityID(entityID: EntityID): Mods | undefined {
  return moddedEntityIDToModMap.get(entityID);
}

export function _clearModdedEntityIDToModMap(): void {
  moddedEntityIDToModMap.clear();
}
