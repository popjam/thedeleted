/**
 * Due to loaded mods not being confirmed until game start, we don't know the EntityID for modded
 * entities until then. We can derive the EntityID from the entities' name and subtype, which is
 * what this type is for. EntityType and Variant are derived using their name and respective 'Isaac'
 * class functions, while the subtype is given.
 *
 * @problem If the entity's subtype is not specified, and there are multiple entities with the same
 *          EntityType and Variant, then the EntityID will be incorrect (it will always return '0'
 *          as the subtype).
 */
export type NameSubType = `${string}.${string}`;
