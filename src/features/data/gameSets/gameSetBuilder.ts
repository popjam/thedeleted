import type { EntityID } from "isaacscript-common";
import { getEnumEntries } from "isaacscript-common";
import { EntityCategory } from "../../../enums/general/EntityCategory";
import { getEntityCategoryFromEntityID } from "../../../helper/entityHelper/entityIDHelper";
import { fprint } from "../../../helper/printHelper";
import {
  _getEntityIDSetEditable,
  _getEntityIDSetEditableFromCategory,
  _getMapOfCategoryToEntityIDSetFromMod,
  _getModSetEditable,
  _getModdedEntityIDSetEditable,
  _getModdedEntityIDSetEditableFromCategory,
  _getModdedEntityIDSetEditableFromMod,
  _getModdedPickupIDSetEditableOfPickupType,
  _getNonModdedEntityIDSetEditable,
  _getNonModdedEntityIDSetEditableFromCategory,
  _getNonModdedPickupIDSetEditableOfPickupType,
  _getPickupIDSetEditableOfPickupType,
  _getSoundEffectIDSetEditable,
  _getSoundEffectIDToNameMapEditable,
  _setModNameForModID,
  getModSet,
} from "./gameSets";
import { getPickupTypeFromPickupID } from "../../../helper/entityHelper/pickupIDHelper";
import type { PickupID } from "../../../enums/data/ID/PickupID";
import { getEntityIDFromEntities2XMLDataEntry } from "../../../helper/xmlHelper";
import type { ModID } from "../../../types/compatibility/ModName";
import {
  EntityType,
  PickupVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import { constantToNormalString } from "../../../helper/stringHelper";
import { XMLNode } from "isaac-typescript-definitions-repentogon";
import type {
  ItemsXMLData,
  SoundsXMLData,
} from "../../../interfaces/compatibility/RepentogonXMLData";

// These entity IDs should not be added to the sets, as they represent all the entities of that
// category.
const ENTITY_IDS_NOT_TO_ADD_TO_SETS = new Set([
  "5.350.0",
  "5.100.0",
  "1.0.0",
  "1.1.0",
]);

/**
 * Upon starting or continuing a game, re-populate the game sets
 * (e.g. gameNPCIDSet, gamePickupIDSet, etc.). These sets hold reference to all entities, sounds,
 * mods, etc that are currently in the game, for easy access. This prevents the need to traverse the
 * XML data every time we need to access a random entity, sound, etc.
 */
export function populateGameSets(): void {
  fprint("Populating game EntityID sets..");

  // Add non-modded and modded entities:
  populateEntitySets();

  // Add non-modded and modded sound effects:
  populateSoundSets();

  // Add non-modded and modded collectibles:
  populateItemSets();

  // Add non-modded and modded trinkets:
  populateTrinketSets();

  // Add mods:
  populateModSets();
}

function sourceIDToModID(sourceID: string): ModID | undefined {
  if (sourceID === "BaseGame") {
    return undefined;
  }

  return sourceID as ModID;
}

function populateModSets() {
  // Look through all the mods and update mod sets.
  const modSet = getModSet();
  for (const modID of modSet) {
    const modXMLData = XMLData.GetModById(modID);
    if (modXMLData === undefined) {
      continue;
    }

    const modName = modXMLData.name;
    if (modName === undefined) {
      continue;
    }

    _setModNameForModID(modID, modName);
  }
}

function populateEntitySets() {
  const nodeType = XMLNode.ENTITY;
  const numEntries = XMLData.GetNumEntries(nodeType);

  for (let i = 0; i < numEntries; i++) {
    const entry = XMLData.GetEntryByOrder(nodeType, i) as
      | Entities2XMLData
      | undefined;

    // To prevent unnecessary traversing of the XML data, we should do everything in this loop.
    if (entry === undefined) {
      continue;
    }

    // Get the EntityID for the entry.
    const entityID = getEntityIDFromEntities2XMLDataEntry(entry);

    // Skip entities that should not be added to the sets.
    if (ENTITY_IDS_NOT_TO_ADD_TO_SETS.has(entityID)) {
      continue;
    }

    // Check if the entity is modded.
    const modID = sourceIDToModID((entry as any).sourceid as string);
    const category = getEntityCategoryFromEntityID(entityID);
    const isPickup = category === EntityCategory.PICKUP;

    // Add to sets.
    addEntityToSets(entityID, modID, category, isPickup);

    // Add to mod set.
    if (modID !== undefined) {
      _getModSetEditable().add(modID);
    }
  }
}

function populateSoundSets() {
  const nodeType = XMLNode.SOUND;
  const numEntries = XMLData.GetNumEntries(nodeType);

  // Add non-modded sound effects:
  const soundEffectEnum = getEnumEntries(SoundEffect);
  for (const [sfxName, sfxID] of soundEffectEnum) {
    const cleanName = constantToNormalString(sfxName);
    _getSoundEffectIDSetEditable().add(sfxID as number);
    _getSoundEffectIDToNameMapEditable().set(sfxID as number, cleanName);
  }

  for (let i = 0; i < numEntries; i++) {
    const entry = XMLData.GetEntryByOrder(nodeType, i) as
      | SoundsXMLData
      | undefined;

    // To prevent unnecessary traversing of the XML data, we should do everything in this loop.
    if (entry === undefined) {
      continue;
    }

    // Get the SfxID for the entry.
    const sfxName = entry.name;
    const sfxNameFixed = constantToNormalString(sfxName);
    const sfxID = Isaac.GetSoundIdByName(sfxName);
    const modID = sourceIDToModID((entry as any).sourceid as string);

    // Add to sfx sets.
    _getSoundEffectIDSetEditable().add(sfxID);
    _getSoundEffectIDToNameMapEditable().set(sfxID, sfxNameFixed);

    // Add to mod set.
    if (modID !== undefined) {
      _getModSetEditable().add(modID);
    }
  }
}

function populateItemSets() {
  const nodeType = XMLNode.ITEM;
  const numEntries = XMLData.GetNumEntries(nodeType);

  for (let i = 0; i < numEntries; i++) {
    const entry = XMLData.GetEntryByOrder(nodeType, i) as
      | ItemsXMLData
      | undefined;
    if (entry === undefined) {
      continue;
    }

    const { id } = entry;

    // Add to item sets.
    if (id === undefined) {
      continue;
    }

    const entityID =
      `${EntityType.PICKUP}.${PickupVariant.COLLECTIBLE}.${id}` as EntityID;
    const modID = sourceIDToModID((entry as any).sourceid as string);
    const category = EntityCategory.PICKUP;

    addEntityToSets(entityID, modID, category, true);
  }
}

function populateTrinketSets() {
  const nodeType = XMLNode.TRINKET;
  const numEntries = XMLData.GetNumEntries(nodeType);

  for (let i = 0; i < numEntries; i++) {
    const entry = XMLData.GetEntryByOrder(nodeType, i) as
      | ItemsXMLData
      | undefined;
    if (entry === undefined) {
      continue;
    }

    const { id } = entry;

    // Add to trinket sets.
    if (id === undefined) {
      continue;
    }

    const entityID =
      `${EntityType.PICKUP}.${PickupVariant.TRINKET}.${id}` as EntityID;
    const modID = sourceIDToModID((entry as any).sourceid as string);
    const category = EntityCategory.PICKUP;

    addEntityToSets(entityID, modID, category, true);
  }
}

function addEntityToSets(
  entityID: EntityID,
  modID: ModID | undefined,
  category: EntityCategory,
  isPickup: boolean,
) {
  // Add to entity sets.
  _getEntityIDSetEditable().add(entityID);
  _getEntityIDSetEditableFromCategory(category).add(entityID);

  if (modID === undefined) {
    // Add to non-modded entity sets.
    _getNonModdedEntityIDSetEditable().add(entityID);
    _getNonModdedEntityIDSetEditableFromCategory(category).add(entityID);
  } else {
    // Add to modded entity sets.
    _getModdedEntityIDSetEditable().add(entityID);
    _getModdedEntityIDSetEditableFromCategory(category).add(entityID);

    // Add to Mod set.
    _getModSetEditable().add(modID);

    // Create a new category set specific to the mod if it doesn't exist.
    let categorySetFromMod =
      _getMapOfCategoryToEntityIDSetFromMod(modID).get(category);
    if (categorySetFromMod === undefined) {
      _getMapOfCategoryToEntityIDSetFromMod(modID).set(
        category,
        new Set([entityID]),
      );
      categorySetFromMod =
        _getMapOfCategoryToEntityIDSetFromMod(modID).get(category);
    }

    if (categorySetFromMod !== undefined) {
      categorySetFromMod.add(entityID);
    }
  }

  // Add to pickup sets.
  if (isPickup) {
    const pickupType = getPickupTypeFromPickupID(entityID as PickupID);

    // Add to pickup sets.
    _getPickupIDSetEditableOfPickupType(pickupType).add(entityID as PickupID);

    if (modID !== undefined) {
      _getModdedPickupIDSetEditableOfPickupType(pickupType).add(
        entityID as PickupID,
      );
    }
  }
}
