import type { EntityID } from "isaacscript-common";
import type { Mods } from "../../../enums/compatibility/Mods";
import { EntityCategory } from "../../../enums/general/EntityCategory";
import type {
  Entities2XML,
  EntityXML,
} from "../../../interfaces/xml/entities2XML";
import * as moddedXMLParser from "../../../lua/moddedXMLParser";
import { getModFromModdedEntityID } from "../../../maps/data/moddedEntityIDToModMap";
import { getNameSubTypeFromModdedEntityID } from "../../../maps/data/moddedEntityIDToNameSubType";
import type { NameSubType } from "../../../types/data/nameSubType";
import { getEntityCategoryFromEntityID } from "../../entityHelper/entityIDHelper";

/**
 * Gets an array of NameSubTypes for the specified entity category and mod. If there are no entities
 * for the specified category, then undefined is returned. These NameSubTypes can then be used to
 * get the entity ID.
 */
export function getModdedEntityNameSubTypesFromCategory(
  mod: Mods,
  entityCategory: EntityCategory,
): readonly NameSubType[] | undefined {
  const entityData = getModdedEntityDataFromCategory(mod, entityCategory);
  if (entityData === undefined) {
    return undefined;
  }
  return Object.keys(entityData) as NameSubType[];
}

/**
 * Get an array of modded entity data for the specified entity category. If the mod does not have
 * any entity data for the specified category (in entities2.xml), then undefined is returned.
 */
export function getModdedEntityDataFromCategory(
  mod: Mods,
  entityCategory: EntityCategory,
): Entities2XML | undefined {
  switch (entityCategory) {
    case EntityCategory.FAMILIAR: {
      return moddedXMLParser.getEntityFamiliars(mod);
    }

    case EntityCategory.PICKUP: {
      return moddedXMLParser.getEntityPickups(mod);
    }

    case EntityCategory.TEAR: {
      return moddedXMLParser.getEntityTears(mod);
    }

    case EntityCategory.BOMB: {
      return moddedXMLParser.getEntityBombs(mod);
    }

    case EntityCategory.KNIFE: {
      return moddedXMLParser.getEntityKnives(mod);
    }

    case EntityCategory.LASER: {
      return moddedXMLParser.getEntityLasers(mod);
    }

    case EntityCategory.NPC: {
      return moddedXMLParser.getEntityNPCs(mod);
    }

    case EntityCategory.PROJECTILE: {
      return moddedXMLParser.getEntityProjectiles(mod);
    }

    case EntityCategory.PLAYER: {
      return moddedXMLParser.getEntityPlayers(mod);
    }

    case EntityCategory.EFFECT: {
      return moddedXMLParser.getEntityEffects(mod);
    }

    case EntityCategory.SLOT: {
      return moddedXMLParser.getEntitySlots(mod);
    }

    default: {
      return undefined;
    }
  }
}

/**
 * Get the entity data for the specified entity category and NameSubType. If the mod does not have
 * any entity data for the specified category (in entities2.xml), then undefined is returned.
 */
export function getModdedEntityDataFromCategoryAndNameSubType(
  mod: Mods,
  entityCategory: EntityCategory,
  nameSubType: NameSubType,
): EntityXML | undefined {
  const entityData = getModdedEntityDataFromCategory(mod, entityCategory);
  if (entityData === undefined) {
    return undefined;
  }
  return entityData[nameSubType];
}

/** Get the modded entity's EntityXML data from only the EntityID. */
export function getModdedEntityDataFromEntityID(
  entityID: EntityID,
): EntityXML | undefined {
  const modFrom = getModFromModdedEntityID(entityID);
  if (modFrom === undefined) {
    return undefined;
  }
  const nameSubType = getNameSubTypeFromModdedEntityID(entityID);
  if (nameSubType === undefined) {
    return undefined;
  }
  const entityCategory = getEntityCategoryFromEntityID(entityID);
  return getModdedEntityDataFromCategoryAndNameSubType(
    modFrom,
    entityCategory,
    nameSubType,
  );
}
