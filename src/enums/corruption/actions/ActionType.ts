/** The possible types of Actions. */
export enum ActionType {
  ON_FLOOR, // done.
  ON_ROOM, // done.
  ON_OBTAIN, // done.
  ON_DAMAGE, // done.
  ON_KILL, // partly done.
  ON_DEATH, // partly done.
  ON_REVIVE, // partly done.
  ON_TEAR,
  ON_ACTIVE_USE, // partly done.
  ON_PILL_USE, // partly done.
  ON_CARD_USE, // partly done.
  ON_BOMB_EXPLODE, // partly done.
  ON_PICKUP_COLLECT, // partly done.
  ON_GREED_WAVE_CLEAR, // partly done.
  ON_GRID_BREAK,
  ON_HOLY_MANTLE_BREAK,
  ON_STAT, // partly done.
  ON_PURCHASE, // partly done.
  ON_ROOM_CLEAR, // partly done.
  ON_SACRIFICE, // partly done.
  ON_SLOT_USE, // partly done.
  ON_SLOT_DESTROY,
  ON_TRANSFORMATION,

  ON_FRIENDLY_FIRE,
}
