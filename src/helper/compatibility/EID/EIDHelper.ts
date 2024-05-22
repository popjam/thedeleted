import type {
  CardType,
  CollectibleType,
  PillColor,
  TrinketType,
} from "isaac-typescript-definitions";
import type { EntityID } from "isaacscript-common";
import {
  getCardName,
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

export function isEIDActive(): boolean {
  return EID !== undefined;
}

/** Returns the Collectible icon for EID. */
export function getEIDIconFromCollectible(
  collectibleType: CollectibleType,
): string {
  return `{{Collectible${collectibleType}}}`;
}

/** Returns the Card icon for EID. */
export function getEIDIconFromCard(cardType: CardType): string {
  return `{{Card${cardType}}}`;
}

/** Returns the PillColor icon for EID. */
export function getPillIconFromEID(pillColor: PillColor): string {
  return `{{Pill${pillColor}}}`;
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

/**
 * Get the specified card's name, icon, or both, aligning with the current EIDTextSetting.
 *
 * @example "The Fool" or "{{CardTheFool}}" or "The Fool {{CardTheFool}}".
 *
 * @param cardType The card type to get the name of.
 * @param plural Whether or not to pluralize the name (default false).
 * @param eid If false, will default to EIDObjectDisplaySetting.TEXT_ONLY (default true).
 */
export function getCardNameWithEIDSetting(
  cardType: CardType,
  plural = false,
  eid = true,
): string {
  const EIDSetting = eid
    ? getEIDTextSetting()
    : EIDObjectDisplaySetting.TEXT_ONLY;
  let text = "";

  if (EIDSetting !== EIDObjectDisplaySetting.ICON_ONLY) {
    text += getCardName(cardType);
  }

  if (EIDSetting === EIDObjectDisplaySetting.TEXT_AND_ICON) {
    text += " ";
  }

  if (EIDSetting !== EIDObjectDisplaySetting.TEXT_ONLY) {
    text += addTheS(getEIDIconFromCard(cardType), plural);
  }

  return text;
}

/**
 * EID Color tags do not support opening multiple color tags at once (like [this]). One might want
 * them supported when using multiple colors in a single string, in a string-catenation-like way.
 * This function simplifies the color tags to only have one opening tag at a time, by adding
 * additional tags. Use this once on the final string to ensure that the color tags are properly
 * formatted.
 *
 * @example "{{ColorRed}}{{ColorPink}}Peach{{CR}}Apple{{CR}} -> "{{ColorRed}}{{CR}}{{ColorBlue}}Peach{{CR}}{{ColorRed}}Apple{{CR}}"
 */
export function simplifyEIDColorTags(str: string): string {
  const stack: string[] = [];
  let result = "";
  let openTag = false;
  for (let i = 0; i < str.length; i++) {
    if (
      str.slice(i, i + 14) === "{{ColorReset}}" ||
      str.slice(i, i + 6) === "{{CR}}"
    ) {
      result += "{{CR}}";
      // If the stack is not empty, add the latest color tag to the result.
      if (stack.length > 0) {
        // If there the most recent tag was an opening tag, we want to remove it from the stack.
        if (openTag) {
          stack.pop();
        }
        if (stack.length > 0) {
          result += openTag ? stack.at(-1) : stack.pop();
          openTag = true;
          i += str.slice(i, i + 14) === "{{ColorReset}}" ? 13 : 5;
          continue;
        }
      }
      // Skip the rest of the color tag.
      i += str.slice(i, i + 14) === "{{ColorReset}}" ? 13 : 5;
      openTag = false;
    } else if (str.slice(i, i + 7) === "{{Color") {
      // If the stack is not empty, prepend a {{CR}} tag before the new color tag.
      if (openTag) {
        result += "{{CR}}";
      }
      const end = str.indexOf("}}", i);
      const color = str.slice(i, end + 2);
      stack.push(color);
      result += color;
      // Skip the rest of the color tag.
      i = end + 1;
      openTag = true;
    } else {
      result += str[i];
    }
  }
  return result;
}
