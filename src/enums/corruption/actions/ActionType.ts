/** The possible types of Actions. */
export enum ActionType {
  ON_FLOOR, // done.
  ON_ROOM, // done.
  ON_OBTAIN, // done.
  ON_DAMAGE, // done.
  ON_KILL, // partly done.
  ON_DEATH,
  ON_TEAR,
  ON_ACTIVE_USE,
  ON_PILL_USE,
  ON_CARD_USE,
  ON_BOMB_EXPLODE,
  ON_PICKUP_COLLECT,
  ON_GREED_WAVE_CLEAR,
  ON_GRID_BREAK,
  ON_HOLY_MANTLE_BREAK,
  ON_STAT,
  ON_PURCHASE,
  ON_ROOM_CLEAR,
  ON_SACRIFICE,
  ON_SLOT_USE,
  ON_SLOT_DESTROY,
  ON_TRANSFORMATION,

  ON_FRIENDLY_FIRE,
}
