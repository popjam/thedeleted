import type { EntityID } from "isaacscript-common";
import {
  VectorZero,
  getConstituentsFromEntityID,
  getNPCs,
  getRandomArrayElementAndRemove,
  spawnNPC,
} from "isaacscript-common";
import { fprint } from "../printHelper";
import type { NPCAttribute } from "../../interfaces/general/NPCAttribute";
import {
  getEntityIDSetFromCategory,
  getModdedEntityIDSetFromCategory,
  getModdedEntityIDSetFromModAndCategory,
  getNonModdedEntityIDSetFromCategory,
} from "../../features/data/gameSets/gameSets";
import { EntityCategory } from "../../enums/general/EntityCategory";
import type { NPCID } from "isaac-typescript-definitions";
import { addArticle } from "../stringHelper";
import { randomInRangeOrNumber } from "../../types/general/Range";
import type { Range } from "../../types/general/Range";
import {
  getEntityBaseHPFromEntityID,
  getEntityConfigFromEntityID,
  getEntityNameFromEntityID,
  getEntitySizeFromEntityID,
} from "./entityIDHelper";

/**
 * Get an ordered list of NPCs children line, including the NPC itself, from specified NPC ->
 * youngest. An NPC may have a child but not have it tracked with the 'Child' property, so be
 * careful.
 *
 * @param npc The specified NPC to look for children.
 * @param children The array of children to add to, should leave this blank.
 */
// eslint-disable-next-line isaacscript/no-mutable-return
export function getAllChildrenNPCs(
  npc: EntityNPC,

  children: EntityNPC[] | undefined = [],
): EntityNPC[] {
  children ??= [];
  const child = npc.Child;

  children.push(npc);

  if (child === undefined) {
    return children;
  }

  if (!isEntityNPC(child)) {
    return children;
  }

  if (children.map((value) => GetPtrHash(value)).includes(GetPtrHash(child))) {
    return children;
  }

  children = getAllChildrenNPCs(child, children);
  return children;
}

/** Is the Entity an NPC. */
export function isEntityNPC(entity: Entity): entity is EntityNPC {
  return entity.ToNPC() !== undefined;
}

/**
 * Get an ordered list of all an NPCs parents, including the NPC itself, from specified NPC ->
 * oldest. If an NPC is recursive (e.g ring flies), this will return the uppermost parent until
 * reaching an NPC already in the chain. Note a parent may have a parent but not have it tracked
 * with the 'Parent' property, so be careful.
 *
 * @param npc The specified NPC to look for children.
 * @param parents The array of parents to add to, should leave this blank.
 */
// eslint-disable-next-line isaacscript/no-mutable-return
export function getAllParentNPCs(
  npc: EntityNPC,

  parents: EntityNPC[] | undefined = [],
): EntityNPC[] {
  parents ??= [];
  const parent = npc.Parent;

  parents.push(npc);

  if (parent === undefined) {
    return parents;
  }

  if (!isEntityNPC(parent)) {
    return parents;
  }

  if (parents.map((value) => GetPtrHash(value)).includes(GetPtrHash(parent))) {
    return parents;
  }

  parents = getAllParentNPCs(parent, parents);
  return parents;
}

/**
 * Retrieve the topmost parent NPC in the parent NPC chain. If the chain is recursive, this will
 * return the uppermost parent until reaching an NPC already in the chain. Note that some NPCs may
 * not track their parents, instead the parent may only track their children.
 */
export function getLastParentNPC(npc: EntityNPC): EntityNPC {
  const parentChain = getAllParentNPCs(npc);
  return parentChain.at(-1) ?? npc;
}

/** Looks through both NPCs lineages and sees if there are any common NPCs between them. */
export function areNPCsRelated(npc1: EntityNPC, npc2: EntityNPC): boolean {
  const npc1PtrHash = GetPtrHash(npc1);
  const npc2PtrHash = GetPtrHash(npc2);

  if (npc1PtrHash === npc2PtrHash) {
    return true;
  }

  const npc1Family = new Set(
    getNPCLineage(npc1).map((value) => GetPtrHash(value)),
  );
  const npc2Family = new Set(
    getNPCLineage(npc2).map((value) => GetPtrHash(value)),
  );

  const commonAncestors = new Set(
    [...npc1Family].filter((value) => npc2Family.has(value)),
  );

  if (commonAncestors.size > 0) {
    return true;
  }

  return false;
}

/**
 * Retrieve all of an NPCs in order from the upmost parent to the last child, which are directly in
 * the child/parent chain. The provided NPC will be included in the list. Note that some children in
 * the family will not be returned by this function, only the direct line to the parent, use
 * 'getNPCFamily()' instead.
 *
 * @example Larry Jr -> Call this function on any segment and it will return the an array like:
 *          [head, mid-body, end-body].
 * @example Ring Fly -> Only will return the last-non repeated parent.
 *
 * To find all children, use 'getNPCFamily()'.
 */
// eslint-disable-next-line isaacscript/no-mutable-return
export function getNPCLineage(npc: EntityNPC): EntityNPC[] {
  const parentChain = getAllParentNPCs(npc).reverse();
  const childChain = getAllChildrenNPCs(npc);

  // Remove repeated NPC from childChain:
  childChain.shift();

  // Conjoin the two chains:
  const lineage = [...parentChain, ...childChain];

  return lineage;
}

/**
 * Retrieve all NPCs in the room that are in some way related to the specified NPC, through parent /
 * child attributes. This will also return the specified NPC. They are not in order.
 *
 * @example The Haunt -> [The Haunt, The Haunt's Ghost, The Haunt's Ghost, The Haunt's Ghost]
 * @example Larry Jr -> [Larry Jr, Larry Jr's Body, Larry Jr's Body, Larry Jr's Body]
 * @example Ring Fly -> [All ring flies in chain]
 *
 * This is different from getNPCLineage(), as it looks through all NPCs in the room and compares
 * NPC lineages, rather than following the parent / child chain.
 */
// eslint-disable-next-line isaacscript/no-mutable-return
export function getNPCFamily(npc: EntityNPC): Set<EntityNPC> {
  const family = new Set<EntityNPC>();
  const tempPtrFamily = new Set<PtrHash>();
  const npcPtrHash = GetPtrHash(npc);
  family.add(npc);
  tempPtrFamily.add(npcPtrHash);

  // Get all the NPCs in the room.
  const npcs = getNPCs();
  for (const npcInRoom of npcs) {
    // If the NPC is related to the provided NPC, add it to the family.
    const npcInRoomPtrHash = GetPtrHash(npcInRoom);
    if (npcPtrHash === npcInRoomPtrHash) {
      continue;
    }
    if (
      areNPCsRelated(npcInRoom, npc) &&
      !tempPtrFamily.has(npcInRoomPtrHash)
    ) {
      family.add(npcInRoom);
      tempPtrFamily.add(npcInRoomPtrHash);
    }
  }

  return family;
}

/**
 * Get an assortment of random NPCIDs, matching the specified NPCAttribute (or any NPCs if
 * NPCAttribute is undefined).
 *
 * @param range The range of how many NPCs to get.
 * @param npcAttribute The NPC Attribute to match (optional).
 * @param seedOrRNG The seed or RNG you want to use (optional).
 * @param unique Whether to make sure the NPCs are unique. If false, the same NPCID may be returned
 *               multiple times. If true, the same NPCID will never be returned twice.
 *
 * @returns An array of NPCIDs or undefined if not enough NPCs were found to match the range.
 */
export function getRandomAssortmentOfNPCs(
  range: Range | number,
  npcAttribute?: NPCAttribute,
  seedOrRNG?: Seed | RNG,
  unique = true,
): readonly NPCID[] | undefined {
  const npcAttributeCopy = { ...npcAttribute };
  const amount = randomInRangeOrNumber(range, seedOrRNG);
  const npcIDs: NPCID[] = [];
  for (let i = 0; i < amount; i++) {
    const npcID = getRandomNPC(npcAttributeCopy, seedOrRNG);

    // If we can't find an NPC, return undefined.
    if (npcID === undefined) {
      return undefined;
    }

    // NPC found, if 'unique' is true add it to banned so we don't get it again.
    npcIDs.push(npcID);

    if (unique) {
      npcAttributeCopy.banned ??= [];
      npcAttributeCopy.banned.push(npcID);
    }
  }

  return npcIDs;
}

/**
 * Spawn a random NPC in the room, that matches the specified NPC Attributes.
 *
 * @param npcAttributes The NPC Attributes you want the random NPC to match (optional).
 * @param seedOrRNG The seed or RNG you want to use (optional).
 * @returns A random NPC or undefined.
 */
export function getRandomNPC(
  npcAttributes?: NPCAttribute,
  seedOrRNG?: Seed | RNG,
): NPCID | undefined {
  let setToUse: ReadonlySet<NPCID>;
  if (npcAttributes === undefined) {
    setToUse = getEntityIDSetFromCategory(EntityCategory.NPC);
    // eslint-disable-next-line unicorn/prefer-switch
  } else if (npcAttributes.modded === true) {
    setToUse = getModdedEntityIDSetFromCategory(EntityCategory.NPC);
  } else if (npcAttributes.modded === false) {
    setToUse = getNonModdedEntityIDSetFromCategory(EntityCategory.NPC);
  } else if (npcAttributes.modded === undefined) {
    setToUse = getEntityIDSetFromCategory(EntityCategory.NPC);
  } else {
    setToUse = getModdedEntityIDSetFromModAndCategory(
      npcAttributes.modded,
      EntityCategory.NPC,
    );
  }

  if (setToUse.size === 0) {
    fprint("getRandomNPC: No NPCs found in the set.");
    return undefined;
  }

  // Copy the set to an array.
  const npcIDArray = [...setToUse];

  // Get a random NPC from the array, that matches the attributes.
  let npcID = getRandomArrayElementAndRemove<NPCID | undefined>(
    npcIDArray,
    seedOrRNG,
  );

  // If there are no attributes, return the NPCID.
  if (npcAttributes === undefined) {
    fprint("No NPC attributes specified, returning random NPC.");
    return npcID;
  }

  // If there are attributes, loop through the array until we find an NPC that matches.
  while (npcID !== undefined) {
    if (doesNPCIDMatchNPCAttributes(npcID, npcAttributes)) {
      break;
    }
    if (npcIDArray.length === 0) {
      return undefined;
    }
    fprint(
      `NPCID with name ${getEntityNameFromEntityID(
        npcID as EntityID,
      )} did not match attributes.`,
    );
    npcID = getRandomArrayElementAndRemove(npcIDArray, seedOrRNG);
  }

  return npcID;
}

/**
 * Helper function to spawn an NPC using its NPCID.
 *
 * Note that if you pass a non-NPC EntityID to this function, it will cause a run-time error, since
 * the Entity.ToNPC method will return undefined.
 *
 * @param npcID The NPCID to spawn.
 * @param positionOrGridIndex The position or grid index to spawn the NPC at.
 * @param velocity The velocity of the NPC (optional).
 * @param spawner The entity that spawned the NPC (optional).
 * @param seedOrRNG The seed or RNG you want to use (optional).
 * @returns The spawned NPC.
 */
export function spawnNPCID(
  npcID: NPCID,
  positionOrGridIndex: int | Vector,
  velocity?: Vector | undefined,
  spawner?: Entity | undefined,
  seedOrRNG?: Seed | RNG,
): EntityNPC {
  const constituents = getConstituentsFromEntityID(npcID as EntityID);
  return spawnNPC(
    constituents[0],
    constituents[1],
    constituents[2],
    positionOrGridIndex,
    velocity,
    spawner,
    seedOrRNG,
  );
}

/**
 * Determines if an NPC is a boss.
 *
 * @param npcID The NPCID to check.
 * @returns Whether the NPC is a boss, undefined if invalid NPCID.
 */
export function isNPCIDBoss(npcID: NPCID): boolean | undefined {
  const config = getEntityConfigFromEntityID(npcID as EntityID);
  return config?.IsBoss();
}

/**
 * Determines if an NPC is flying, by quickly spawning and removing it. Note that this may cause
 * additional lag or problems in some cases.
 *
 * @param npcID The NPCID to check.
 * @returns Whether the NPC is flying, undefined if invalid NPCID.
 */
export function isNPCIDFlying(npcID: NPCID): boolean {
  const constituents = getConstituentsFromEntityID(npcID as EntityID);
  const npc = spawnNPC(
    constituents[0],
    constituents[1],
    constituents[2],
    VectorZero,
  );
  npc.Visible = false;
  const flying = npc.IsFlying();
  npc.Remove();
  return flying;
}

/**
 * Determines if an NPC matches the specified NPC Attributes.
 *
 * @param npcID The NPCID to check.
 * @param npcAttributes The NPC Attributes to check.
 * @returns Whether the NPC matches the attributes. Note that if the NPCID is modded, it will not be
 *          able to ascertain NPCID attributes if the mod is not tracked. In this case, it will
 *          always return false.
 */
export function doesNPCIDMatchNPCAttributes(
  npcID: NPCID,
  npcAttributes: NPCAttribute,
): boolean {
  // Forced match.
  const { forced } = npcAttributes;
  if (forced !== undefined && forced.includes(npcID)) {
    return true;
  }

  // Banned from being matched.
  const { banned } = npcAttributes;
  if (banned !== undefined && banned.includes(npcID)) {
    return false;
  }

  // Flying.
  const { flying } = npcAttributes;
  if (flying !== undefined) {
    const npcFlying = isNPCIDFlying(npcID);
    if (npcFlying !== flying) {
      return false;
    }
  }

  // Boss.
  const { boss } = npcAttributes;
  if (boss !== undefined) {
    const npcBoss = isNPCIDBoss(npcID) ?? false;
    if (npcBoss !== boss) {
      return false;
    }
  }

  // Size.
  const { size } = npcAttributes;
  if (size !== undefined) {
    const npcSize = getEntitySizeFromEntityID(npcID as EntityID);
    if (npcSize === undefined) {
      return false;
    }
    if (!(npcSize >= size[0] && npcSize <= size[1])) {
      return false;
    }
  }

  // MaxHitPoints.
  const { health } = npcAttributes;
  if (health !== undefined) {
    const npcSize = getEntityBaseHPFromEntityID(npcID as EntityID);
    if (npcSize === undefined) {
      return false;
    }
    if (!(npcSize >= health[0] && npcSize <= health[1])) {
      return false;
    }
  }

  // Starts with (capitalization doesn't matter). If the NPC does not have a registered name, always
  // return false.
  const { startsWith } = npcAttributes;
  if (startsWith !== undefined) {
    const npcName = getEntityNameFromEntityID(npcID as EntityID)?.toLowerCase();
    if (npcName === undefined) {
      return false;
    }
    if (!npcName.startsWith(startsWith.toLowerCase())) {
      return false;
    }
  }

  // Starts with (capitalization doesn't matter). If the NPC does not have a registered name, always
  // return false.
  const { endsWith } = npcAttributes;
  if (endsWith !== undefined) {
    const npcName = getEntityNameFromEntityID(npcID as EntityID)?.toLowerCase();
    if (npcName === undefined) {
      return false;
    }
    if (!npcName.endsWith(endsWith.toLowerCase())) {
      return false;
    }
  }

  return true;
}

/**
 * Converts a NPCAttribute object to its appropriate text.
 *
 * @example { flying: true, boss: true } -> "a flying boss".
 * @param npcAttributes The NPC Attributes to convert.
 * @param plural Whether to make the text plural (e.g "enemies" instead of "enemy").
 * @param prefixTextBeforeEnemy Any text to add before the enemy (e.g "a random enemy" -> "a random
 *                              champion enemy").
 */
export function npcAttributesToText(
  npcAttributes: NPCAttribute,
  plural = false,
  prefixTextBeforeEnemy = "",
): string {
  let text = "";

  // Modded.
  const { modded } = npcAttributes;
  if (modded !== undefined) {
    if (modded === true) {
      text += "modded ";
    } else if (modded === false) {
      text += "non-modded ";
    }
    // If modded is a Mod, we add the mod name at the end.
  }

  // Flying.
  const { flying } = npcAttributes;
  if (flying !== undefined) {
    text += flying ? "flying " : "non-flying ";
  }

  // Size.
  const { size } = npcAttributes;
  if (size !== undefined) {
    text += `size: ${size}, `;
  }

  // MaxHitPoints.
  const { health } = npcAttributes;
  if (health !== undefined) {
    text += `health: ${health}, `;
  }

  // Add the prefix text before the enemy.
  text += ` ${prefixTextBeforeEnemy} `;

  // Add the 'enemy' at the end.
  const { boss } = npcAttributes;
  if (boss === undefined || !boss) {
    text += plural ? "enemies " : "enemy ";
  } else {
    text += plural ? "bosses " : "boss ";
  }

  // Starts with (capitalization doesn't matter). If the NPC does not have a registered name, always
  // return false.
  const { startsWith } = npcAttributes;
  if (startsWith !== undefined) {
    text += `starting with "${startsWith.toUpperCase()}" `;
  }

  // Ends with (capitalization doesn't matter). If the NPC does not have a registered name, always
  // return false.
  const { endsWith } = npcAttributes;
  if (endsWith !== undefined) {
    text += `ending with "${endsWith.toUpperCase()}" `;
  }

  // Add the mod name at the end if modded is a Mod.
  if (modded !== undefined && typeof modded === "string") {
    text += `from ${modded} `;
  }

  text = plural ? text : addArticle(text);
  return text;
}
