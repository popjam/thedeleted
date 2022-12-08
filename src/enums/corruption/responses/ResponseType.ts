/** The possible types of Responses. */
export enum ResponseType {
  /** Trigger a Random response in a weighted array. */
  TRIGGER_RANDOM,
  /** Wait X seconds then trigger Response. */
  WAIT_THEN_TRIGGER,
  /** Trigger a Response multiple times over a period of time. */
  TRIGGER_OVER_TIME,
  /** Trigger one Response after another. */
  TRIGGER_IN_SEQUENCE,
  /** If a condition is met, trigger the Response. */
  IF_THEN_TRIGGER,
  /** If a condition is met, trigger the Response, else trigger another Response. */
  IF_THEN_ELSE_TRIGGER,
  /** Trigger a Response in a queue, then 'rotate' the queue ready for the next Response. */
  TRIGGER_IN_QUEUE,

  // Game
  USE_ACTIVE_ITEM,
  USE_CARD,
  USE_PILL,
  GET_COLLECTIBLE,
  GET_TRINKET,
  GET_CONSUMABLE,
  SPAWN_PICKUP,
  SPAWN_NPC,
  SPAWN_SLOT,
  SPAWN_TEAR,
  SPAWN_PROJECTILE,
  SPAWN_EFFECT,
  SPAWN_GRID,
  SPAWN_LIVE_BOMB,
  PLAY_SOUND,
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
  SPAWN_WORLD,
  HAVE_DREAM,
  HAVE_NIGHTMARE,
  GET_ACTION_SET,
  TEMPORARY_ACTION,
  TEMPORARY_COLLECTIBLE,
  TEMPORARY_TRINKET,
  TEMPORARY_RULE,
  PLAY_TUNE,
  ADD_RULE,
}
