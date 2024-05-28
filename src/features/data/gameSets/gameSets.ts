import type { EntityID } from "isaacscript-common";
import { DefaultMap } from "isaacscript-common";
import type { EntityCategory } from "../../../enums/general/EntityCategory";
import { mod } from "../../../mod";
import type { PickupID } from "../../../enums/data/ID/PickupID";
import type { EntityIDTypeUnion } from "../../../types/data/IDTypes";
import type { PickupType } from "../../../enums/general/PickupType";
import type { ModID } from "../../../types/compatibility/ModName";
import type {
  CollectibleType,
  ItemPoolType,
  SoundEffect,
} from "isaac-typescript-definitions";

/**
 * This feature is responsible for generating sets filled with EntityIDs for easy access (e.g for
 * random entity spawning). It will reset per run, as the user may have disabled mods, or enabled
 * new ones.
 */
const v = {
  run: {
    /** Mods recognized by the game. This should be the name value found in 'metadata.xml'. */
    mods: new Set<ModID>(),
    modToNameMap: new DefaultMap<ModID, string>("unknown mod"),

    /** Entity sets. */
    nonModdedEntities: new Set<EntityID>(),
    moddedEntities: new Set<EntityID>(),
    entities: new Set<EntityID>(),

    /** Entity sets for each EntityCategory. */
    entityCategorySets: new DefaultMap<EntityCategory, Set<EntityID>>(
      () => new Set<EntityID>(),
    ),
    moddedEntityCategorySets: new DefaultMap<EntityCategory, Set<EntityID>>(
      () => new Set<EntityID>(),
    ),
    nonModdedEntityCategorySets: new DefaultMap<EntityCategory, Set<EntityID>>(
      () => new Set<EntityID>(),
    ),

    /** Sets specific to mods. */
    modSets: new DefaultMap<ModID, Set<EntityID>>(() => new Set<EntityID>()),
    modCategorySets: new DefaultMap<ModID, Map<EntityCategory, Set<EntityID>>>(
      () => new Map<EntityCategory, Set<EntityID>>(),
    ),

    /** Sets specific to pickups. */
    pickupIDOfPickupTypeMap: new DefaultMap<PickupType, Set<PickupID>>(
      () => new Set<PickupID>(),
    ),
    nonModdedPickupIDOfPickupTypeMap: new DefaultMap<PickupType, Set<PickupID>>(
      () => new Set<PickupID>(),
    ),
    moddedPickupIDOfPickupTypeMap: new DefaultMap<PickupType, Set<PickupID>>(
      () => new Set<PickupID>(),
    ),

    // Sounds.
    soundIDSet: new Set<SoundEffect>(),
    soundIDToNameMap: new DefaultMap<SoundEffect, string>(
      "generic sound effect",
    ),

    // Item Pools.
    itemPoolTypeCollectibleTypeMap: new DefaultMap<
      ItemPoolType,
      Set<CollectibleType>
    >(() => new Set<CollectibleType>()),
    collectibleTypeToItemPoolTypesMap: new DefaultMap<
      CollectibleType,
      Set<ItemPoolType>
    >(() => new Set<ItemPoolType>()),
  },
};

export function gameEntitySetBuilderInit(): void {
  mod.saveDataManager("gameEntitySetBuilder", v);
}

export function getModSet(): ReadonlySet<ModID> {
  return v.run.mods;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getModSetEditable(): Set<ModID> {
  return v.run.mods;
}

export function getModNameFromModID(modID: ModID): string {
  return v.run.modToNameMap.getAndSetDefault(modID);
}

export function _setModNameForModID(modID: ModID, modName: string): void {
  v.run.modToNameMap.set(modID, modName);
}

/** Returns a set of non-modded EntityID's. */
export function getNonModdedEntityIDSet(): ReadonlySet<EntityID> {
  return v.run.nonModdedEntities;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getNonModdedEntityIDSetEditable(): Set<EntityID> {
  return v.run.nonModdedEntities;
}

/**
 * Returns a set of modded EntityIDs. Entities will only be added to this set if the mod is active
 * and tracked by this mod.
 */
export function getModdedEntityIDSet(): ReadonlySet<EntityID> {
  return v.run.moddedEntities;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getModdedEntityIDSetEditable(): Set<EntityID> {
  return v.run.moddedEntities;
}

/**
 * Returns a set of all EntityID's, modded and non-Modded. Entities will only be added to this set
 * if the mod is active and tracked by this mod.
 */
export function getEntityIDSet(): ReadonlySet<EntityID> {
  return v.run.entities;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getEntityIDSetEditable(): Set<EntityID> {
  return v.run.entities;
}

/**
 * Returns a set of non-modded EntityIDs for the given EntityCategory. Will return undefined if
 * there are no non-modded entities for the given category.
 */
export function getNonModdedEntityIDSetFromCategory<
  Type extends EntityIDTypeUnion = EntityID,
>(category: EntityCategory): ReadonlySet<Type> {
  return v.run.nonModdedEntityCategorySets.get(
    category,
  ) as unknown as ReadonlySet<Type>;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getNonModdedEntityIDSetEditableFromCategory(
  category: EntityCategory,
): Set<EntityID> {
  return v.run.nonModdedEntityCategorySets.getAndSetDefault(category);
}

/**
 * Returns a set of modded EntityIDs for the given EntityCategory. Will return undefined if there
 * are no modded entities for the given category.
 */
export function getModdedEntityIDSetFromCategory<
  Type extends EntityIDTypeUnion = EntityID,
>(category: EntityCategory): ReadonlySet<Type> {
  return v.run.moddedEntityCategorySets.getAndSetDefault(
    category,
  ) as unknown as ReadonlySet<Type>;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getModdedEntityIDSetEditableFromCategory(
  category: EntityCategory,
): Set<EntityID> {
  return v.run.moddedEntityCategorySets.getAndSetDefault(category);
}

/** Returns a set of EntityIDs for the given EntityCategory. */
export function getEntityIDSetFromCategory<
  Type extends EntityIDTypeUnion = EntityID,
>(category: EntityCategory): ReadonlySet<Type> {
  return v.run.entityCategorySets.getAndSetDefault(
    category,
  ) as unknown as ReadonlySet<Type>;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getEntityIDSetEditableFromCategory(
  category: EntityCategory,
): Set<EntityID> {
  return v.run.entityCategorySets.getAndSetDefault(category);
}

/**
 * Returns a set of modded EntityIDs for the given mod. Will return undefined if there are no modded
 * entities for the given mod.
 */
export function getModdedEntityIDSetFromMod(
  activeMod: ModID,
): ReadonlySet<EntityID> | undefined {
  return v.run.modSets.get(activeMod);
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getModdedEntityIDSetEditableFromMod(
  activeMod: ModID,
): Set<EntityID> {
  return v.run.modSets.getAndSetDefault(activeMod);
}

/**
 * Returns a set of modded EntityIDs for the given mod and EntityCategory. Will return undefined if
 * there are no modded entities for the given mod and category.
 */
export function getModdedEntityIDSetFromModAndCategory<
  Type extends EntityIDTypeUnion = EntityID,
>(activeMod: ModID, category: EntityCategory): ReadonlySet<Type> {
  return (v.run.modCategorySets.getAndSetDefault(activeMod).get(category) ??
    new Set()) as ReadonlySet<Type>;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getMapOfCategoryToEntityIDSetFromMod(
  activeMod: ModID,
): Map<EntityCategory, Set<EntityID>> {
  return v.run.modCategorySets.getAndSetDefault(activeMod);
}

export function getPickupIDSetOfPickupType(
  pickupType: PickupType,
): ReadonlySet<PickupID> {
  return v.run.pickupIDOfPickupTypeMap.getAndSetDefault(pickupType);
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getPickupIDSetEditableOfPickupType(
  pickupType: PickupType,
): Set<PickupID> {
  return v.run.pickupIDOfPickupTypeMap.getAndSetDefault(pickupType);
}

export function getNonModdedPickupIDSetOfPickupType(
  pickupType: PickupType,
): ReadonlySet<PickupID> {
  return v.run.nonModdedPickupIDOfPickupTypeMap.getAndSetDefault(pickupType);
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getNonModdedPickupIDSetEditableOfPickupType(
  pickupType: PickupType,
): Set<PickupID> {
  return v.run.nonModdedPickupIDOfPickupTypeMap.getAndSetDefault(pickupType);
}

export function getModdedPickupIDSetOfPickupType(
  pickupType: PickupType,
): ReadonlySet<PickupID> {
  return v.run.moddedPickupIDOfPickupTypeMap.getAndSetDefault(pickupType);
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getModdedPickupIDSetEditableOfPickupType(
  pickupType: PickupType,
): Set<PickupID> {
  return v.run.moddedPickupIDOfPickupTypeMap.getAndSetDefault(pickupType);
}

export function getSoundEffectIDSet(): ReadonlySet<SoundEffect> {
  return v.run.soundIDSet;
}

// eslint-disable-next-line isaacscript/no-mutable-return
export function _getSoundEffectIDSetEditable(): Set<SoundEffect> {
  return v.run.soundIDSet;
}

/**
 * Retrieves the sound name associated with the given soundEffect ID.
 *
 * @param soundID The soundEffect ID to retrieve the name for.
 * @returns The name of the sound.
 */
export function getSoundNameFromSoundEffectID(soundID: SoundEffect): string {
  return v.run.soundIDToNameMap.getAndSetDefault(soundID);
}

export function _getSoundEffectIDToNameMapEditable(): DefaultMap<
  SoundEffect,
  string
> {
  return v.run.soundIDToNameMap;
}

/**
 * Retrieves the collectibles from the item pool type.
 *
 * @param itemPoolType The item pool type.
 * @returns A readonly set of collectible types.
 */
export function getCollectiblesFromItemPoolType(
  itemPoolType: ItemPoolType,
): ReadonlySet<CollectibleType> {
  return v.run.itemPoolTypeCollectibleTypeMap.getAndSetDefault(itemPoolType);
}

export function _setCollectiblesSetForItemPoolType(
  itemPoolType: ItemPoolType,
  collectibles: Set<CollectibleType>,
): void {
  v.run.itemPoolTypeCollectibleTypeMap.set(itemPoolType, collectibles);
}

/**
 * Retrieves the item pool types from the collectible type.
 *
 * @param collectibleType The collectible type.
 * @returns A readonly set of item pool types.
 */
export function getCollectibleItemPoolTypes(
  collectibleType: CollectibleType,
): ReadonlySet<ItemPoolType> {
  return v.run.collectibleTypeToItemPoolTypesMap.getAndSetDefault(
    collectibleType,
  );
}

export function _addItemPoolTypeToCollectibleType(
  collectibleType: CollectibleType,
  itemPoolType: ItemPoolType,
): void {
  v.run.collectibleTypeToItemPoolTypesMap
    .getAndSetDefault(collectibleType)
    .add(itemPoolType);
}
