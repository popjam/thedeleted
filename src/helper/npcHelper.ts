import { fprint } from "./printHelper";

/**
 * Get an ordered list of all an NPCs children, including the NPC itself.
 *
 * @param npc The specified NPC to look for children.
 * @param children The array of children to add to, should leave this blank.
 */
export function getAllChildrenNPCs(
  npc: EntityNPC,
  children: EntityNPC[] | undefined = [],
): EntityNPC[] {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  children = children ?? [];
  const child = npc.Child;

  fprint(`Pushing ${GetPtrHash(npc)} to children array.`);
  children.push(npc);

  if (child === undefined) {
    return children;
  }

  if (!isNPC(child)) {
    return children;
  }

  if (children.map((value) => GetPtrHash(value)).includes(GetPtrHash(child))) {
    return children;
  }

  children = getAllChildrenNPCs(child as EntityNPC, children);
  return children;
}

/** Is the Entity an NPC. */
export function isNPC(entity: Entity): boolean {
  return entity.ToNPC() !== undefined;
}

/** Retrieve the topmost parent NPC in the parent NPC chain. */
export function getLastParentNPC(npc: EntityNPC): EntityNPC {
  if (npc.Parent === undefined) {
    return npc;
  }
  if (npc.Parent.ToNPC() === undefined) {
    return npc;
  }
  return getLastParentNPC(npc.ParentNPC);
}

/**
 * Retrieve all NPCs in the family tree, in order from oldest parent to youngest child.
 *
 * @example Larry Jr -> Call this function on any segment and it will return the an array like:
 *          [head, mid-body, end-body].
 */
export function getNPCFamily(npc: EntityNPC): EntityNPC[] {
  const parent = getLastParentNPC(npc);
  const children = getAllChildrenNPCs(parent);
  return children;
}
