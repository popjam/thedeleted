/** The possible types of Responses. */
export enum ResponseType {
  // TODO: For logic responses, add a 'contains' func to check the types of responses contained.

  /** Trigger a Random response in a weighted array. */
  TRIGGER_RANDOM, // done.

  /** Wait X seconds then trigger Response. */
  WAIT_THEN_TRIGGER, // done.

  /** Trigger a Response multiple times over a period of time. */
  TRIGGER_OVER_TIME, // done.

  /** Trigger one Response after another. */
  TRIGGER_IN_SEQUENCE, // done.

  /** If a condition is met, trigger the Response. */
  IF_THEN_TRIGGER, // done.

  /** If a condition is met, trigger the Response, else trigger another Response. */
  IF_THEN_ELSE_TRIGGER, // done.

  /** Trigger a Response in a queue, then 'rotate' the queue ready for the next Response. */
  TRIGGER_IN_QUEUE, // done.

  // Game
  USE_ACTIVE_ITEM, // done.
  USE_CARD,
  USE_PILL,
  GET_COLLECTIBLE, // done.
  GET_TRINKET, // done.
  GET_CONSUMABLE,
  SPAWN_PICKUP, // done.
  SPAWN_NPC, // done.
  SPAWN_SLOT, // done.
  SPAWN_TEAR, // done.
  SPAWN_PROJECTILE,
  SPAWN_EFFECT, // done.
  SPAWN_GRID, // done (wtg for repentogon).
  SPAWN_ENTITY, // done.
  SPAWN_LIVE_BOMB, // done.
  PLAY_SOUND, // done (fix random sound).
  PLAY_MUSIC,
  GIVE_COSTUME,
  GIVE_STAT,
  TRANSFORM,
  EXECUTE_COMMAND,
  SHOW_FORTUNE,

  // Mostly negative.
  GIVE_CURSE,
  REMOVE_ENTITY,
  REMOVE_GRID,
  REMOVE_CORRUPTED_ITEM,
  REMOVE_COLLECTIBLE,
  REMOVE_TRINKET,
  REMOVE_RULE,
  REROLL_COLLECTIBLE,
  REROLL_TRINKET,
  REROLL_STAT,
  CHANGE_CHARACTER,

  // Custom
  SPAWN_HYBRID_NPC,
  PLAY_CORRUPTED_SOUND,
  SPAWN_WORLD,
  HAVE_DREAM,
  HAVE_NIGHTMARE,
  GET_ACTION_SET,
  TEMPORARY_ACTION,
  TEMPORARY_ACTION_SET,
  TEMPORARY_COLLECTIBLE,
  TEMPORARY_TRINKET,
  TEMPORARY_RULE,
  PLAY_TUNE,
  ADD_RULE,
  REMOVE_ACTION,
}
