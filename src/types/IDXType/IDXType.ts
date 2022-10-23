import { AnyEntityIDX } from "../../enums/IDX/AnyEntityIDX";
import { AudioIDX } from "../../enums/IDX/AudioIDX";
import { EntityIDX } from "../../enums/IDX/EntityIDX";
import { GridEntityIDX } from "../../enums/IDX/GridEntityIDX";
import { MusicIDX } from "../../enums/IDX/MusicIDX";
import { FiendFolioNPCIDX, NPCIDX } from "../../enums/IDX/NPCIDX";
import { PickupIDX } from "../../enums/IDX/PickupIDX";
import { SoundEffectIDX } from "../../enums/IDX/SoundEffectIDX";
import { ThingIDX } from "../../enums/IDX/ThingIDX";
import { objectContainsValue } from "../../helper/objectHelper";

/** Subset of EntityIDXType. */
export type PickupIDXType = typeof PickupIDX[keyof typeof PickupIDX];

/** e.g 5.100.1 */
export function isPickupIDXType(arg: string): arg is PickupIDXType {
  return arg in PickupIDX;
}

/** Subset of EntityIDXType. */
export type NPCIDXType = typeof NPCIDX[keyof typeof NPCIDX];

/** e.g 20.0 */
export function isNPCIDXType(arg: string): arg is NPCIDXType {
  if (FiendFolio !== undefined) {
    if (objectContainsValue<string>(FiendFolioNPCIDX, arg)) {
      return true;
    }
  }
  return objectContainsValue<string>(NPCIDX, arg);
}

/** Subset of AnyEntityIDXType. */
export type EntityIDXType = PickupIDXType | NPCIDXType;

/** e.g 5.0.0 */
export function isEntityIDXType(arg: string): arg is EntityIDXType {
  return arg in EntityIDX;
}

/** Subset of AnyEntityIDXType. */
export type GridEntityIDXType =
  typeof GridEntityIDX[keyof typeof GridEntityIDX];

/** e.g 5.0 */
export function isGridEntityIDXType(arg: string): arg is GridEntityIDXType {
  return arg in GridEntityIDX;
}

/** Subset of ThingIDXType. */
export type AnyEntityIDXType = GridEntityIDXType | EntityIDXType;

// eslint-disable-next-line isaacscript/complete-sentences-jsdoc
/** e.g 5.0 or 5.0.0. */
export function isAnyEntityIDXType(arg: string): arg is AnyEntityIDXType {
  return arg in AnyEntityIDX;
}

/** Sub-set of AudioIDXType. */
export type SoundEffectIDXType =
  typeof SoundEffectIDX[keyof typeof SoundEffectIDX];

/** e.g S.0 */
export function isSoundEffectIDXType(arg: string): arg is SoundEffectIDXType {
  return arg in SoundEffectIDX;
}

/** Sub-set of AudioIDXType. */
export type MusicIDXType = typeof MusicIDX[keyof typeof MusicIDX];

/** e.g M.0 */
export function isMusicIDXType(arg: string): arg is MusicIDXType {
  return arg in MusicIDX;
}

/** Sub-set of ThingIDXType. */
export type AudioIDXType = SoundEffectIDXType | MusicIDXType;

// eslint-disable-next-line isaacscript/complete-sentences-jsdoc
/** e.g M.0 or S.0 */
export function isAudioIDXType(arg: string): arg is AudioIDXType {
  return arg in AudioIDX;
}

/** Super set. */
export type ThingIDXType = AnyEntityIDXType | AudioIDXType;

/** Super set. */
export function isThingIDXType(arg: string): arg is ThingIDXType {
  return arg in ThingIDX;
}
