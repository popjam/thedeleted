import type { EntityID } from "isaacscript-common";
import { log, spawnEntityID } from "isaacscript-common";
import {
  getEntityCategory,
  getQuickAccessiblePosition,
} from "../../helper/entityHelper";
import type { EntityCategory } from "../../enums/general/EntityCategory";
import { isEntityID } from "../../helper/entityHelper/entityIDHelper";
import { splitString } from "../../helper/stringHelper";
import { fprint } from "../../helper/printHelper";

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
