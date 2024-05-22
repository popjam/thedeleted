/** Functions related to Repentogon's XMLData class. */

import type { EntityID } from "isaacscript-common";
import { XMLNode } from "isaac-typescript-definitions-repentogon";

export function getEntityIDFromEntities2XMLDataEntry(
  entry: Entities2XMLData,
): EntityID {
  const entityType = (entry.id === "" ? "0" : entry.id) ?? "0";
  const variant = (entry.variant === "" ? "0" : entry.variant) ?? "0";
  const subType = (entry.subtype === "" ? "0" : entry.subtype) ?? "0";
  return `${entityType}.${variant}.${subType}` as EntityID;
}

/**
 * Retrieves the XML data for entities.
 *
 * @returns An array of Entities2XMLData objects.
 */
export function getEntitiesXMLData(): readonly Entities2XMLData[] {
  const nodeType = XMLNode.ENTITY;
  const numEntries = XMLData.GetNumEntries(nodeType);
  const xmlEntries = [] as Entities2XMLData[];

  for (let i = 0; i < numEntries; i++) {
    const entry = XMLData.GetEntryByOrder(nodeType, i);
    if (entry) {
      xmlEntries.push(entry as unknown as Entities2XMLData);
    }
  }

  return xmlEntries;
}

export function getEntityIDSetNew(): ReadonlySet<EntityID> {
  const entitiesXMLData = getEntitiesXMLData();
  const entityIDSet = new Set<EntityID>();

  for (const entity of entitiesXMLData) {
    const entityType = (entity.id === "" ? "0" : entity.id) ?? "0";
    const variant = (entity.variant === "" ? "0" : entity.variant) ?? "0";
    const subType = (entity.subtype === "" ? "0" : entity.subtype) ?? "0";
    const entityID = `${entityType}.${variant}.${subType}`;
    entityIDSet.add(entityID as EntityID);
  }

  return entityIDSet;
}
