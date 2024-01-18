import type {
  CollectibleType,
  TrinketType,
} from "isaac-typescript-definitions";
import type { EntityID } from "isaacscript-common";
import {
  getCollectibleName,
  getConstituentsFromEntityID,
  getEntityID,
  getTrinketName,
} from "isaacscript-common";
import { EID_ENTITY_DATA_KEY } from "../../../constants/eidConstants";
import type { EIDColorShortcut } from "../../../enums/compatibility/EID/EIDColor";
import type { Morality } from "../../../enums/corruption/Morality";
import type { EIDDescObject } from "../../../interfaces/compatibility/EIDDescObject";
import { getEIDColorShortcutFromMorality } from "../../../maps/compatibility/EIDColorMap";
import { getEIDTextSetting } from "../../../features/settings/EIDSettings";
import { EIDObjectDisplaySetting } from "../../../enums/settings/EIDObjectDisplaySetting";
import { addTheS } from "../../stringHelper";

/** Returns the Collectible icon for EID. */
export function getEIDIconFromCollectible(
  collectibleType: CollectibleType,
): string {
  return `{{Collectible${collectibleType}}}`;
}

/** Returns the Trinket icon for EID. */
export function getEIDIconFromTrinket(trinketType: TrinketType): string {
  return `{{Trinket${trinketType}}}`;
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
    return undefined;
  }
  if (typeof entity !== "string") {
    entity = getEntityID(entity);
  }
  const constituents = getConstituentsFromEntityID(entity);
  return EID.getDescriptionObj(...constituents) as unknown as EIDDescObject;
}

/**
 * Get the specified collectible's name, icon, or both, aligning with the current EIDTextSetting.
 */
export function getCollectibleNameWithEIDSetting(
  collectibleType: CollectibleType,
  plural = false,
  eid = true,
): string {
  const EIDSetting = eid
    ? getEIDTextSetting()
    : EIDObjectDisplaySetting.TEXT_ONLY;
  let text = "";

  if (EIDSetting !== EIDObjectDisplaySetting.ICON_ONLY) {
    text += getCollectibleName(collectibleType);
  }

  if (EIDSetting === EIDObjectDisplaySetting.TEXT_AND_ICON) {
    text += " ";
  }

  if (EIDSetting !== EIDObjectDisplaySetting.TEXT_ONLY) {
    text += addTheS(getEIDIconFromCollectible(collectibleType), plural);
  }

  return text;
}

/**
 * Get the specified trinket's name, icon, or both, aligning with the current EIDTextSetting.
 *
 * @example "Match Stick" or "{{TrinketMatchStick}}" or "Match Stick {{TrinketMatchStick}}".
 *
 * @param trinketType The trinket type to get the name of.
 * @param plural Whether or not to pluralize the name (default false).
 * @param eid If false, will default to EIDObjectDisplaySetting.TEXT_ONLY (default true).
 */
export function getTrinketNameWithEIDSetting(
  trinketType: TrinketType,
  plural = false,
  eid = true,
): string {
  const EIDSetting = eid
    ? getEIDTextSetting()
    : EIDObjectDisplaySetting.TEXT_ONLY;
  let text = "";

  if (EIDSetting !== EIDObjectDisplaySetting.ICON_ONLY) {
    text += getTrinketName(trinketType);
  }

  if (EIDSetting === EIDObjectDisplaySetting.TEXT_AND_ICON) {
    text += " ";
  }

  if (EIDSetting !== EIDObjectDisplaySetting.TEXT_ONLY) {
    text += addTheS(getEIDIconFromTrinket(trinketType), plural);
  }

  return text;
}
