/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { EntityID } from "isaacscript-common";
import {
  getEnumKeys,
  getEnumValues,
  log,
  spawnEntityID,
} from "isaacscript-common";
import {
  getEntityCategory,
  getQuickAccessiblePosition,
} from "../../entityHelper";
import type { EntityCategory } from "../../../enums/general/EntityCategory";
import { getEntityIDFromNameSubType } from "../../entityHelper/entityIDHelper";
import { splitString } from "../../stringHelper";
import { fprint } from "../../printHelper";
import { ItemPoolType, CollectibleType } from "isaac-typescript-definitions";

/** 1. First, 'entities2Parser.py' is run to generate the */

/**
 * For a pool of entities, returns a map of entities that match the entityCategory, in the form of
 * Key = [name, subType]
 */
export function filterEntities2Map(
  entityMap:
    | Map<string, [string, number]>
    | ReadonlyMap<string, [string, number]>,
  entityCategory: EntityCategory,
): Map<string, [string, number]> {
  const filteredMap = new Map<string, [string, number]>();
  for (const [key, [name, subType]] of entityMap) {
    const type = Isaac.GetEntityTypeByName(name) as number;
    const variant = Isaac.GetEntityVariantByName(name);
    if (type === -1 || variant === -1) {
      fprint(
        `Could not find entity: ${name}, type: ${type}, variant: ${variant}`,
      );
      continue;
    }
    const idToSpawn = `${type}.${variant}.${subType}`;
    log(`Found entity ID: ${idToSpawn}, with name: ${name}`);
    const entity = spawnEntityID(
      idToSpawn as EntityID,
      getQuickAccessiblePosition(),
    );
    if (entity === undefined) {
      fprint(`Could not spawn entity: ${idToSpawn}`);
      continue;
    }
    const category = getEntityCategory(entity);
    if (category === entityCategory) {
      filteredMap.set(key, [name, subType]);
    }
    entity.Remove();
  }
  return filteredMap;
}

export function logEntities2Map(
  effectMap: Map<string, [string, number]>,
): void {
  log(`logging effect map of size: ${effectMap.size}`);

  // Log the result in the format of a typescript enum entry:
  let stringToPrint = "";
  for (const [key, nameSubType] of effectMap) {
    const name = nameSubType[0];
    const subType = nameSubType[1];

    const str = `${key}: "${subType}.${name}",`;
    stringToPrint += str;
  }

  // Split string in two:
  for (const str of splitString(stringToPrint, 4)) {
    log(str);
  }
}

export function logModNPCFlyingAsSet(
  nameSubTypeEnum: any,
  nameOfEnum: string,
  sliceStart?: number,
  sliceEnd?: number,
): void {
  const modNameSubTypeEnumKeys = getEnumKeys(nameSubTypeEnum);

  // Get subset up to 'FiendFolioNameSubType.FIEND_FOLIO_SHOPKEEPER'.
  const modNameSubTypeEnumKeysSubset = modNameSubTypeEnumKeys.slice(
    sliceStart ?? 0,
    sliceEnd ?? modNameSubTypeEnumKeys.length,
  );

  let str = "";
  for (const modNameSubTypeKey of modNameSubTypeEnumKeysSubset) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const nameSubType =
      nameSubTypeEnum[modNameSubTypeKey as keyof typeof nameSubTypeEnum];
    const npcID = getEntityIDFromNameSubType(nameSubType);
    if (npcID === undefined) {
      continue;
    }
    const ent = spawnEntityID(npcID, getQuickAccessiblePosition());
    if (ent.IsFlying()) {
      str += `${nameOfEnum}.${modNameSubTypeKey},`;
    }
    ent.Remove();
  }

  log(str);
}

export function logModNPCBossesAsSet(
  nameSubTypeEnum: any,
  nameOfEnum: string,
  sliceStart?: number,
  sliceEnd?: number,
): void {
  const modNameSubTypeEnumKeys = getEnumKeys(nameSubTypeEnum);

  // Get subset up to 'FiendFolioNameSubType.FIEND_FOLIO_SHOPKEEPER'.
  const modNameSubTypeEnumKeysSubset = modNameSubTypeEnumKeys.slice(
    sliceStart ?? 0,
    sliceEnd ?? modNameSubTypeEnumKeys.length,
  );

  let str = "";
  for (const modNameSubTypeKey of modNameSubTypeEnumKeysSubset) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const nameSubType =
      nameSubTypeEnum[modNameSubTypeKey as keyof typeof nameSubTypeEnum];
    const npcID = getEntityIDFromNameSubType(nameSubType);
    if (npcID === undefined) {
      continue;
    }
    const ent = spawnEntityID(npcID, getQuickAccessiblePosition());
    if (ent.IsBoss()) {
      str += `${nameOfEnum}.${modNameSubTypeKey},`;
    }
    ent.Remove();
  }

  log(str);
}

export function logModEntitySizesAsObjects(
  nameSubTypeEnum: any,
  nameOfEnum: string,
  sliceStart?: number,
  sliceEnd?: number,
): void {
  const modNameSubTypeEnumKeys = getEnumKeys(nameSubTypeEnum);

  // Get subset up to 'FiendFolioNameSubType.FIEND_FOLIO_SHOPKEEPER'.
  const modNameSubTypeEnumKeysSubset = modNameSubTypeEnumKeys.slice(
    sliceStart ?? 0,
    sliceEnd ?? modNameSubTypeEnumKeys.length,
  );

  let str = "";
  for (const modNameSubTypeKey of modNameSubTypeEnumKeysSubset) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const nameSubType =
      nameSubTypeEnum[modNameSubTypeKey as keyof typeof nameSubTypeEnum];
    const npcID = getEntityIDFromNameSubType(nameSubType);
    if (npcID === undefined) {
      continue;
    }
    const ent = spawnEntityID(npcID, getQuickAccessiblePosition());
    const size = ent.Size;
    str += `[${nameOfEnum}.${modNameSubTypeKey}]: ${size},`;
    ent.Remove();
  }

  log(str);
}

export function logModEntityMassesAsObjects(
  nameSubTypeEnum: any,
  nameOfEnum: string,
  sliceStart?: number,
  sliceEnd?: number,
): void {
  const modNameSubTypeEnumKeys = getEnumKeys(nameSubTypeEnum);

  // Get subset up to 'FiendFolioNameSubType.FIEND_FOLIO_SHOPKEEPER'.
  const modNameSubTypeEnumKeysSubset = modNameSubTypeEnumKeys.slice(
    sliceStart ?? 0,
    sliceEnd ?? modNameSubTypeEnumKeys.length,
  );

  let str = "";
  for (const modNameSubTypeKey of modNameSubTypeEnumKeysSubset) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const nameSubType =
      nameSubTypeEnum[modNameSubTypeKey as keyof typeof nameSubTypeEnum];
    const npcID = getEntityIDFromNameSubType(nameSubType);
    if (npcID === undefined) {
      continue;
    }
    const ent = spawnEntityID(npcID, getQuickAccessiblePosition());
    const size = ent.Mass;
    str += `[${nameOfEnum}.${modNameSubTypeKey}]: ${size},`;
    ent.Remove();
  }

  log(str);
}

export function logModEntityMaxHitPointsAsObject(
  nameSubTypeEnum: any,
  nameOfEnum: string,
  sliceStart?: number,
  sliceEnd?: number,
): void {
  const modNameSubTypeEnumKeys = getEnumKeys(nameSubTypeEnum);

  // Get subset up to 'FiendFolioNameSubType.FIEND_FOLIO_SHOPKEEPER'.
  const modNameSubTypeEnumKeysSubset = modNameSubTypeEnumKeys.slice(
    sliceStart ?? 0,
    sliceEnd ?? modNameSubTypeEnumKeys.length,
  );

  let str = "";
  for (const modNameSubTypeKey of modNameSubTypeEnumKeysSubset) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const nameSubType =
      nameSubTypeEnum[modNameSubTypeKey as keyof typeof nameSubTypeEnum];
    const npcID = getEntityIDFromNameSubType(nameSubType);
    if (npcID === undefined) {
      continue;
    }
    const ent = spawnEntityID(npcID, getQuickAccessiblePosition());
    const size = ent.MaxHitPoints;
    str += `[${nameOfEnum}.${modNameSubTypeKey}]: ${size},`;
    ent.Remove();
  }

  log(`logModEntityMaxHitPointsAsObject: ${str}`);
}

export function logNonModdedEntitiesAttributes(
  nonModdedEnum: any,
  nonModdedEnumName: string,
  sliceStart?: number,
  sliceEnd?: number,
): void {
  const enumValuesNonSliced = getEnumValues(nonModdedEnum);
  const enumValues = enumValuesNonSliced.slice(
    sliceStart ?? 0,
    sliceEnd ?? enumValuesNonSliced.length,
  );
  let str = "";

  for (const enumValue of enumValues) {
    const entity = spawnEntityID(
      enumValue as EntityID,
      getQuickAccessiblePosition(),
    );
    const key = getEnumKeys(nonModdedEnum).find(
      (key) => nonModdedEnum[key as keyof typeof nonModdedEnum] === enumValue,
    );

    if (entity === undefined) {
      continue;
    }

    // Attribute.
    const maxHitPoints = entity.MaxHitPoints;

    entity.Remove();

    // Log.
    str += `[${nonModdedEnumName}.${key}, ${maxHitPoints}],`;
  }

  log(`nonModdedLog: ${str}`);
}

export function logNonModdedCollectibleTypeItemPoolMap(
  map: Map<number, ItemPoolType[]>,
): void {
  let str = "";
  for (const [key, value] of map) {
    const keyAsString = getEnumKeys(CollectibleType).find(
      (k) => CollectibleType[k as keyof typeof CollectibleType] === key,
    );
    const valueAsString: string[] = [];
    for (const itemPoolType of value) {
      const itemPoolTypeAsString = getEnumKeys(ItemPoolType).find(
        (k) => ItemPoolType[k as keyof typeof ItemPoolType] === itemPoolType,
      );
      if (itemPoolTypeAsString === undefined) {
        continue;
      }
      valueAsString.push(`ItemPoolType.${itemPoolTypeAsString}`);
    }
    log(`[CollectibleType.${keyAsString}, [${valueAsString.join(",")}]],`);
  }

  // // Split into multiple lines. for (const strSplit of splitString(str, 20)) { log(strSplit); }
}
