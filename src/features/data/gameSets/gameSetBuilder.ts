import {
  game,
  getConstituentsFromEntityID,
  getEnumEntries,
} from "isaacscript-common";
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
} from "./gameSets";
import { getPickupTypeFromPickupID } from "../../../helper/entityHelper/pickupIDHelper";
import type { PickupID } from "../../../enums/data/ID/PickupID";
import { XMLNode } from "../../../temporary/XMLNode";
import { getEntityIDFromEntities2XMLDataEntry } from "../../../helper/xmlHelper";
import type { ModName } from "../../../types/compatibility/ModName";
import { ItemPoolType, SoundEffect } from "isaac-typescript-definitions";
import { constantToNormalString } from "../../../helper/stringHelper";

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
    const [entityType, variant, subType] =
      getConstituentsFromEntityID(entityID);
    const entityConfigEntry = EntityConfig.GetEntity(
      entityType,
      variant,
      subType,
    );

    if (entityConfigEntry === undefined) {
      continue;
    }

    // Check if the entity is modded.
    const modName = entityConfigEntry.GetModName();
    const modded = modName !== undefined;
    const category = getEntityCategoryFromEntityID(entityID);
    const isPickup = category === EntityCategory.PICKUP;

    // Add to entity sets.
    _getEntityIDSetEditable().add(entityID);
    _getEntityIDSetEditableFromCategory(category).add(entityID);

    if (modded) {
      fprint(`Adding modded entity to set: ${entityID} (${modName})`);

      // Add to modded entity sets.
      _getModdedEntityIDSetEditable().add(entityID);
      _getModdedEntityIDSetEditableFromCategory(category).add(entityID);

      // Add to mod sets.
      _getModSetEditable().add(modName as ModName);

      // Create a new category set specific to the mod if it doesn't exist.
      let categorySetFromMod = _getMapOfCategoryToEntityIDSetFromMod(
        modName as ModName,
      ).get(category);
      if (categorySetFromMod === undefined) {
        _getMapOfCategoryToEntityIDSetFromMod(modName as ModName).set(
          category,
          new Set([entityID]),
        );
        categorySetFromMod = _getMapOfCategoryToEntityIDSetFromMod(
          modName as ModName,
        ).get(category);
      }

      if (categorySetFromMod !== undefined) {
        categorySetFromMod.add(entityID);
      }
    } else {
      // Add to non-modded entity sets.
      _getNonModdedEntityIDSetEditable().add(entityID);
      _getNonModdedEntityIDSetEditableFromCategory(category).add(entityID);
    }

    // Add to pickup sets.
    if (isPickup) {
      const pickupType = getPickupTypeFromPickupID(entityID as PickupID);

      // Add to pickup sets.
      _getPickupIDSetEditableOfPickupType(pickupType).add(entityID as PickupID);

      if (modded) {
        _getModdedPickupIDSetEditableOfPickupType(pickupType).add(
          entityID as PickupID,
        );
      } else {
        _getNonModdedPickupIDSetEditableOfPickupType(pickupType).add(
          entityID as PickupID,
        );
      }
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

    // Add to sfx sets.
    _getSoundEffectIDSetEditable().add(sfxID);
    _getSoundEffectIDToNameMapEditable().set(sfxID, sfxNameFixed);
  }
}
