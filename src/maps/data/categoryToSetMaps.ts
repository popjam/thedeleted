import { NPCID } from "isaac-typescript-definitions";
import { EntityCategory } from "../../enums/general/EntityCategory";
import {
  getModdedNPCIDSet,
  getNPCIDSet,
  getNonModdedNPCIDSet,
} from "../../sets/data/npc/NPCIDSets";

const ENTITY_CATEGORY_TO_GAME_ENTITY_ID_MAP: ReadonlyMap<
  EntityCategory,
  () => Set<string>
> = new Map([[EntityCategory.NPC, () => getNPCIDSet()]]);

/**
 * From an Entity Category (e.g 'NPCs'), finds the set of all tracked modded + non modded entityIDs.
 */
export function getGameEntityIDSetForCategory(
  category: EntityCategory,
): Set<string> | undefined {
  const set = ENTITY_CATEGORY_TO_GAME_ENTITY_ID_MAP.get(category);
  if (set === undefined) {
    return undefined;
  }

  return set();
}

const ENTITY_CATEGORY_TO_GAME_NON_MODDED_ENTITY_ID_MAP: ReadonlyMap<
  EntityCategory,
  () => Set<string>
> = new Map([[EntityCategory.NPC, () => getNonModdedNPCIDSet()]]);

/** From an Entity Category (e.g 'NPCs'), finds the set of all tracked non-modded entityIDs. */
export function getGameNonModdedEntityIDSetForCategory(
  category: EntityCategory,
): Set<string> | undefined {
  const set = ENTITY_CATEGORY_TO_GAME_NON_MODDED_ENTITY_ID_MAP.get(category);
  if (set === undefined) {
    return undefined;
  }

  return set();
}

const ENTITY_CATEGORY_TO_GAME_MODDED_ENTITY_ID_MAP: ReadonlyMap<
  EntityCategory,
  () => Set<string>
> = new Map([[EntityCategory.NPC, () => getModdedNPCIDSet()]]);

/** From an Entity Category (e.g 'NPCs'), finds the set of all tracked modded entityIDs. */
export function getGameModdedEntityIDSetForCategory(
  category: EntityCategory,
): Set<string> | undefined {
  const set = ENTITY_CATEGORY_TO_GAME_MODDED_ENTITY_ID_MAP.get(category);
  if (set === undefined) {
    return undefined;
  }

  return set();
}

const ENTITY_CATEGORY_TO_BASE_ENTITY_ID_MAP: ReadonlyMap<
  EntityCategory,
  Record<string, string>
> = new Map([[EntityCategory.NPC, NPCID]]);

/** From an Entity Category (e.g 'NPCs'), finds the set of all base entityIDs. */
export function getBaseEntityIDSetForCategory(
  category: EntityCategory,
): Set<string> | undefined {
  const set = ENTITY_CATEGORY_TO_BASE_ENTITY_ID_MAP.get(category);
  if (set === undefined) {
    return undefined;
  }

  return new Set(Object.values(set));
}
