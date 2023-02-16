import { CollectibleType } from "isaac-typescript-definitions";
import {
  EntityID,
  getConstituentsFromEntityID,
  getEntityID,
} from "isaacscript-common";
import { EID_ENTITY_DATA_KEY } from "../../constants/eidConstants";
import { EIDColorShortcut } from "../../enums/compatibility/EIDColor";
import { Morality } from "../../enums/corruption/Morality";
import { EIDDescObject } from "../../interfaces/compatibility/EIDDescObject";
import { getEIDColorShortcutFromMorality } from "../../maps/compatibility/EIDColorMap";

/** Returns the Collectible icon for EID. */
export function getEIDIconFromCollectible(
  collectibleType: CollectibleType,
): string {
  return `{{Collectible${collectibleType}}}`;
}

/** Convert a shortcut string to an EID Markup Object. */
export function getEIDMarkupFromShortcut(shortcut: string): string {
  return `{{${shortcut}}}`;
}

/**
 * Convert a shortcut string to an EID Markup Object. This may be a KColor or a function which
 * returns a KColor.
 */
export function getEIDMarkupFromEIDColorShortcut(
  shortcut: EIDColorShortcut,
): string {
  return `{{${shortcut}}}`;
}

/** Get the recommended EID Markup shortcut from Morality. */
export function getEIDMarkupFromMorality(morality: Morality): string {
  return getEIDMarkupFromShortcut(getEIDColorShortcutFromMorality(morality));
}

/**
 * Sets an EID description unique to a specific entity (with a unique index). This will override
 * more generic EID descriptions.
 */
export function setSpecificEntityEIDDescriptionObject(
  entity: Entity,
  object: EIDDescObject,
): void {
  if (EID === undefined) {
    return;
  }
  entity.GetData()[EID_ENTITY_DATA_KEY] = object;
}

/**
 * Obtain the generic EID Description of the entity. This EID Description will be prevalent on all
 * entities of the same type. It does not get overridden by specific EID Descriptions.
 */
export function getGenericEntityEIDDescriptionObject(
  entity: Entity | EntityID,
): EIDDescObject | undefined {
  if (EID === undefined) {
    return;
  }
  if (typeof entity !== "string") {
    entity = getEntityID(entity);
  }
  const constituents = getConstituentsFromEntityID(entity);
  return EID.getDescriptionObj(...constituents) as unknown as EIDDescObject;
}
