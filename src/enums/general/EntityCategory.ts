/** The categories non-Grid Entities belong to. */
export enum EntityCategory {
  FAMILIAR = 0,
  TEAR = 1,
  BOMB = 2,
  KNIFE = 3,
  LASER = 4,
  NPC = 5,
  PROJECTILE = 6,
  PICKUP = 7,
  PLAYER = 8,
  EFFECT = 9,
  SLOT = 10,
}

/**
 * The categories entities belong to, including grids. These entity categories have the same values
 * as the EntityCategory enum, however type casting may be necessary.
 */
export enum EntityCategoryWithGrid {
  FAMILIAR = 0,
  TEAR = 1,
  BOMB = 2,
  KNIFE = 3,
  LASER = 4,
  NPC = 5,
  PROJECTILE = 6,
  PICKUP = 7,
  PLAYER = 8,
  EFFECT = 9,
  SLOT = 10,
  GRID = 11,
}
