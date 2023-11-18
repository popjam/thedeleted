/**
 * Gets a modded Entity Name + SubType string (e.g "0.HoneyFox") from its Entity ID (e.g "27.1.0").
 * This map will be populated upon game start, as modded Entity ID's are not known until then.
 *
 * This map is necessary as other maps for modded entities will use the Entity Name + SubType string
 * as a key. The EntityID will first be converted to the Entity Name + SubType string, and then used
 * to get the value from the other maps.
 */
const MODDED_ENTITY_ID_TO_NAME_SUBTYPE_MAP = new Map<string, string>([]);

/** Map the modded EntityID to its name + subType ID (e.g "0.HoneyFox"). */
export function _addModdedEntityIDToNameSubTypeMap(
  entityID: string,
  nameSubType: string,
): void {
  MODDED_ENTITY_ID_TO_NAME_SUBTYPE_MAP.set(entityID, nameSubType);
}

/**
 * Get the modded Entity Name + SubType string from its Entity ID. If the EntityID does not exist in
 * the map, return undefined. This may happen when a modded entity is not tracked.
 */
export function getNameSubTypeFromEntityID(
  entityID: string,
): string | undefined {
  return MODDED_ENTITY_ID_TO_NAME_SUBTYPE_MAP.get(entityID);
}

export function _clearModdedEntityIDToNameSubTypeMap(): void {
  MODDED_ENTITY_ID_TO_NAME_SUBTYPE_MAP.clear();
}
