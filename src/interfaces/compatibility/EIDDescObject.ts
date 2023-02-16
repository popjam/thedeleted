import { EntityType } from "isaac-typescript-definitions";

/** Alternative to 'EIDDescriptionObject' that is more accurate. */
export interface EIDDescObject {
  /** Type of the Entity. */
  ObjType?: EntityType;
  /** Variant of the Entity. */
  ObjVariant?: number;
  /** Subtype of the Entity. */
  ObjSubType?: number;
  /** Combined string that describes the entity. */
  fullItemString?: string;
  /** Translated name of the entity. */
  Name?: string;
  /** Unformatted translated EID description. */
  Description?: string;
  /** Transformation Object. */
  Transformation?: string;
  /** Mod name. */
  ModName?: string;
  /** Quality of the item, 0-4. */
  Quality?: number;
  /** Object icon on the top left. */
  Icon?: EIDInlineIcon;
  /** Entity Object which is currently described. */
  Entity?: Entity;
}
