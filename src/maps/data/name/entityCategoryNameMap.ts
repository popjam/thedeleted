import { EntityCategory } from "../../../enums/general/EntityCategory";

const ENTITY_CATEGORY_NAME_MAP: ReadonlyMap<EntityCategory, string> = new Map([
  [EntityCategory.FAMILIAR, "Familiar"],
  [EntityCategory.TEAR, "Tear"],
  [EntityCategory.BOMB, "Bomb"],
  [EntityCategory.KNIFE, "Knife"],
  [EntityCategory.LASER, "Laser"],
  [EntityCategory.NPC, "Enemy"],
  [EntityCategory.PROJECTILE, "Projectile"],
  [EntityCategory.PICKUP, "Pickup"],
  [EntityCategory.PLAYER, "Player"],
  [EntityCategory.EFFECT, "Effect"],
  [EntityCategory.SLOT, "Slot"],
]);

/**
 * Convert an EntityCategory to a string value.
 *
 * @example `entityCategoryToString(EntityCategory.FAMILIAR)` returns `"Familiar"`.
 */
export function entityCategoryToString(entityCategory: EntityCategory): string {
  const entityCategoryName = ENTITY_CATEGORY_NAME_MAP.get(entityCategory);
  if (entityCategoryName === undefined) {
    error(`Unknown EntityCategory '${entityCategory}'`);
  }

  return entityCategoryName;
}
