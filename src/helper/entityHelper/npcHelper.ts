import { getNPCs, getRandomEnumValue, spawnNPC } from "isaacscript-common";
import { NPCID } from "../../enums/general/ID/NPCID";
import { fprint } from "../printHelper";
import type { NPCAttribute } from "../../interfaces/general/NPCAttribute";
import { getNPCNameFromNPCID } from "../../maps/data/name/npcNames";

/**
 * Get an ordered list of NPCs children line, including the NPC itself, from specified NPC ->
 * youngest. An NPC may have a child but not have it tracked with the 'Child' property, so be
 * careful.
 *
 * @param npc The specified NPC to look for children.
 * @param children The array of children to add to, should leave this blank.
 */
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
    fprint(
      `are ${npc1PtrHash} and ${npc2PtrHash} related? they are the same NPC`,
    );
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
    fprint(
      `are ${npc1PtrHash} and ${npc2PtrHash} related? true, they have common ancestors`,
    );
    return true;
  }

  fprint(`are ${npc1PtrHash} and ${npc2PtrHash} related? false`);
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

// TODO.
export function getRandomNPC(): NPCID {
  return getRandomEnumValue(NPCID);
}

export function doesNPCIDMatchNPCAttributes(
  npcID: NPCID,
  npcAttributes: NPCAttribute,
): boolean {
  // Starts with (capitalization doesn't matter). If the NPC does not have a registered name, always
  // return false.
  const { startsWith } = npcAttributes;
  if (startsWith !== undefined) {
    const npcName = getNPCNameFromNPCID(npcID);
    if (npcName === undefined) {
      return false;
    }

    const npcNameStartsWith = npcName
      .toLowerCase()
      .startsWith(startsWith.toLowerCase());
    if (!npcNameStartsWith) {
      return false;
    }
  }

  // Starts with (capitalization doesn't matter). If the NPC does not have a registered name, always
  // return false.
  const { endsWith } = npcAttributes;
  if (endsWith !== undefined) {
    const npcName = getNPCNameFromNPCID(npcID);
    if (npcName === undefined) {
      return false;
    }

    const npcNameEndsWith = npcName
      .toLowerCase()
      .endsWith(endsWith.toLowerCase());
    if (!npcNameEndsWith) {
      return false;
    }
  }

  return true;
}
