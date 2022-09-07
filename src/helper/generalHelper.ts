/** Retrieves the distance between two known entities. */
export function getDistanceBetweenEntities(
  entity1: Entity,
  entity2: Entity,
): number {
  return entity1.Position.Distance(entity2.Position);
}
