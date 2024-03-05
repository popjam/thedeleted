import type { EntityID } from "isaacscript-common";
import { game, getEnumValues } from "isaacscript-common";
import type { Mods } from "../../../enums/compatibility/Mods";
import { EntityCategory } from "../../../enums/general/EntityCategory";
import {
  _clearModdedEntityIDToModMap,
  _addModdedEntityIDToModMap,
} from "../../../maps/data/moddedEntityIDToModMap";
import {
  _clearModdedEntityIDToNameSubTypeMap,
  _addModdedEntityIDToNameSubTypeMap,
} from "../../../maps/data/moddedEntityIDToNameSubType";
import type { NameSubType } from "../../../types/data/nameSubType";
import { getModdedEntityNameSubTypesFromCategory } from "../../../helper/compatibility/XML/moddedXMLParserHelper";
import { getActiveMods } from "../../../helper/compatibility/externalModHelper";
import {
  getBaseEntityIDSetFromCategory,
  getEntityIDFromNameSubType,
} from "../../../helper/entityHelper/entityIDHelper";
import { fprint } from "../../../helper/printHelper";
import {
  _getEntityIDSetEditable,
  _getEntityIDSetEditableFromCategory,
  _getMapOfCategoryToEntityIDSetFromMod,
  _getModdedEntityIDSetEditable,
  _getModdedEntityIDSetEditableFromCategory,
  _getModdedEntityIDSetEditableFromMod,
  _getModdedPickupIDSetEditableOfPickupType,
  _getNonModdedEntityIDSetEditable,
  _getNonModdedEntityIDSetEditableFromCategory,
  _getNonModdedPickupIDSetEditableOfPickupType,
  _getPickupIDSetEditableOfPickupType,
} from "./gameEntitySets";
import { getPickupTypeFromPickupID } from "../../../helper/entityHelper/pickupIDHelper";
import type { PickupID } from "../../../enums/data/ID/PickupID";
import { ModCallbackRepentogon } from "isaac-typescript-definitions";

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
  _getModdedEntityIDSetEditable().add(entityID);
  _getEntityIDSetEditable().add(entityID);

  // Add to category sets, creating a new set if it doesn't exist.
  _getEntityIDSetEditableFromCategory(category).add(entityID);
  _getModdedEntityIDSetEditableFromCategory(category).add(entityID);

  // Add to mod sets, creating a new set if it doesn't exist.
  _getModdedEntityIDSetEditableFromMod(activeMod).add(entityID);
  const categoryToEntityIDSetMap =
    _getMapOfCategoryToEntityIDSetFromMod(activeMod);
  let modCategorySet = categoryToEntityIDSetMap.get(category);
  if (modCategorySet === undefined) {
    modCategorySet = new Set();
    categoryToEntityIDSetMap.set(category, modCategorySet);
  }
  modCategorySet.add(entityID);

  // Add to maps.
  _addModdedEntityIDToNameSubTypeMap(entityID, nameSubType);
  _addModdedEntityIDToModMap(entityID, activeMod);

  // If it's a pickup, add to pickup sets.
  if (category === EntityCategory.PICKUP) {
    const pickupType = getPickupTypeFromPickupID(entityID as PickupID);
    _getPickupIDSetEditableOfPickupType(pickupType).add(entityID as PickupID);
    _getModdedPickupIDSetEditableOfPickupType(pickupType).add(
      entityID as PickupID,
    );
  }
}

function addNonModdedEntityIDToSets(
  entityID: EntityID,
  category: EntityCategory,
) {
  // Add to entity sets.
  _getEntityIDSetEditable().add(entityID);
  _getNonModdedEntityIDSetEditable().add(entityID);

  // Add to category sets, creating a new set if it doesn't exist.
  _getEntityIDSetEditableFromCategory(category).add(entityID);
  _getNonModdedEntityIDSetEditableFromCategory(category).add(entityID);

  // If it's a pickup, add to pickup sets.
  if (category === EntityCategory.PICKUP) {
    const pickupType = getPickupTypeFromPickupID(entityID as PickupID);
    _getPickupIDSetEditableOfPickupType(pickupType).add(entityID as PickupID);
    _getNonModdedPickupIDSetEditableOfPickupType(pickupType).add(
      entityID as PickupID,
    );
  }
}
