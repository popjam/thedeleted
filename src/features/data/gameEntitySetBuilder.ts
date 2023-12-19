import type { NPCID } from "isaac-typescript-definitions";
import { fprint } from "../../helper/printHelper";
import type { EntityID } from "isaacscript-common";
import {
  DefaultMap,
  ReadonlyMap,
  game,
  getEnumValues,
} from "isaacscript-common";
import { getActiveMods } from "../../helper/compatibility/externalModHelper";
import {
  getBaseEntityIDSetFromCategory,
  getEntityIDFromNameSubType,
} from "../../helper/entityHelper/entityIDHelper";
import { EntityCategory } from "../../enums/general/EntityCategory";
import {
  _addModdedEntityIDToNameSubTypeMap,
  _clearModdedEntityIDToNameSubTypeMap,
} from "../../maps/data/moddedEntityIDToNameSubType";
import {
  _addModdedEntityIDToModMap,
  _clearModdedEntityIDToModMap,
} from "../../maps/data/moddedEntityIDToModMap";
import { mod } from "../../mod";
import type { Mods } from "../../enums/compatibility/Mods";
import { getModdedEntityNameSubTypesFromCategory } from "../../helper/compatibility/XML/moddedXMLParserHelper";
import type { NameSubType } from "../../types/data/nameSubType";

/**
 * This feature is responsible for generating sets filled with EntityIDs for easy access (e.g for
 * random entity spawning). It will reset per run, as the user may have disabled mods, or enabled
 * new ones.
 */
const v = {
  run: {
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
    modSets: new DefaultMap<Mods, Set<EntityID>>(() => new Set<EntityID>()),
    modCategorySets: new DefaultMap<Mods, Map<EntityCategory, Set<EntityID>>>(
      () => new Map<EntityCategory, Set<EntityID>>(),
    ),
  },
};

export function gameEntitySetBuilderInit(): void {
  mod.saveDataManager("gameEntitySetBuilder", v);
}

/**
 * Upon starting or continuing a game, re-populate the game EntityID sets
 * (e.g. gameNPCIDSet, gamePickupIDSet, etc.). These sets hold reference to all non-modded and known
 * modded entities in the game for easy access.
 */
export function populateGameEntitySets(): void {
  fprint("Populating game EntityID sets..");

  // Add non-modded NPCs:
  populateNonModdedEntities();

  // Add to modded sets / maps. Sets will already be populated with base entities.
  populateModdedEntities();
}

/** Returns a set of non-modded EntityID's. */
export function getNonModdedEntityIDSet(): ReadonlySet<EntityID> {
  return v.run.nonModdedEntities;
}

/**
 * Returns a set of modded EntityIDs. Entities will only be added to this set if the mod is active
 * and tracked by this mod.
 */
export function getModdedEntityIDSet(): ReadonlySet<EntityID> {
  return v.run.moddedEntities;
}

/**
 * Returns a set of all EntityID's, modded and non-Modded. Entities will only be added to this set
 * if the mod is active and tracked by this mod.
 */
export function getEntityIDSet(): ReadonlySet<EntityID> {
  return v.run.entities;
}

/**
 * Returns a set of non-modded EntityIDs for the given EntityCategory. Will return undefined if
 * there are no non-modded entities for the given category.
 */
export function getNonModdedEntityIDSetFromCategory(
  category: EntityCategory,
): ReadonlySet<EntityID> | undefined {
  return v.run.nonModdedEntityCategorySets.get(category);
}

/**
 * Returns a set of modded EntityIDs for the given EntityCategory. Will return undefined if there
 * are no modded entities for the given category.
 */
export function getModdedEntityIDSetFromCategory(
  category: EntityCategory,
): ReadonlySet<EntityID> | undefined {
  return v.run.moddedEntityCategorySets.get(category);
}

/**
 * Returns a set of EntityIDs for the given EntityCategory. Will return undefined if there are no
 * entities for the given category.
 */
export function getEntityIDSetFromCategory(
  category: EntityCategory,
): ReadonlySet<EntityID> | undefined {
  return v.run.entityCategorySets.get(category);
}

/**
 * Returns a set of modded EntityIDs for the given mod. Will return undefined if there are no modded
 * entities for the given mod.
 */
export function getModdedEntityIDSetFromMod(
  activeMod: Mods,
): ReadonlySet<EntityID> | undefined {
  return v.run.modSets.get(activeMod);
}

/**
 * Returns a set of modded EntityIDs for the given mod and EntityCategory. Will return undefined if
 * there are no modded entities for the given mod and category.
 */
export function getModdedEntityIDSetFromModAndCategory(
  activeMod: Mods,
  category: EntityCategory,
): ReadonlySet<EntityID> | undefined {
  return v.run.modCategorySets.get(activeMod)?.get(category);
}

/** Populate non-modded + modded & non-modded sets. */
function populateNonModdedEntities() {
  for (const category of getEnumValues(EntityCategory)) {
    const entityIDSet = getBaseEntityIDSetFromCategory(category);
    for (const entityID of entityIDSet) {
      addNonModdedEntityIDToSets(entityID, category);
    }
  }
}

function populateModdedEntities() {
  _clearModdedEntityIDToNameSubTypeMap();
  _clearModdedEntityIDToModMap();

  for (const activeMod of getActiveMods()) {
    for (const category of getEnumValues(EntityCategory)) {
      const moddedNameSubTypesOfCategory =
        getModdedEntityNameSubTypesFromCategory(activeMod, category);

      // If no modded nameSubTypes exist for this mod and category, skip.
      if (moddedNameSubTypesOfCategory === undefined) {
        continue;
      }

      // Go through each modded nameSubType and add it to the sets.
      for (const nameSubType of moddedNameSubTypesOfCategory) {
        const entityID = getEntityIDFromNameSubType(nameSubType);
        if (entityID === undefined) {
          continue;
        }
        addModdedEntityIDToSets(entityID, category, activeMod, nameSubType);
      }
    }
  }
}

function addModdedEntityIDToSets(
  entityID: EntityID,
  category: EntityCategory,
  activeMod: Mods,
  nameSubType: NameSubType,
) {
  // Add to entity sets.
  v.run.moddedEntities.add(entityID);
  v.run.entities.add(entityID);

  // Add to category sets, creating a new set if it doesn't exist.
  v.run.entityCategorySets.getAndSetDefault(category).add(entityID);
  v.run.moddedEntityCategorySets.getAndSetDefault(category).add(entityID);

  // Add to mod sets, creating a new set if it doesn't exist.
  v.run.modSets.getAndSetDefault(activeMod).add(entityID);
  const modCategorySet = v.run.modCategorySets
    .getAndSetDefault(activeMod)
    .get(category);
  if (modCategorySet === undefined) {
    v.run.modCategorySets.getAndSetDefault(activeMod).set(category, new Set());
  }
  v.run.modCategorySets
    .getAndSetDefault(activeMod)
    .get(category)
    ?.add(entityID);

  // Add to maps.
  _addModdedEntityIDToNameSubTypeMap(entityID, nameSubType);
  _addModdedEntityIDToModMap(entityID, activeMod);
}

function addNonModdedEntityIDToSets(
  entityID: EntityID,
  category: EntityCategory,
) {
  // Add to entity sets.
  v.run.nonModdedEntities.add(entityID);
  v.run.entities.add(entityID);

  // Add to category sets, creating a new set if it doesn't exist.
  v.run.entityCategorySets.getAndSetDefault(category).add(entityID);
  v.run.nonModdedEntityCategorySets.getAndSetDefault(category).add(entityID);
}

// POST_GAME_STARTED_REORDERED, isContinued: FALSE. Used to initialize game entity sets.
export function postGameStartedReorderedGameEntitySetBuilder(): void {
  populateGameEntitySets();
}
