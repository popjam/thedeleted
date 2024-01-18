/**
 * Requirements that may need to be completed to invoke certain features or responses. Conditionals
 * may require a number value to complement them (e.g PLAYER_HAS_X_OR_MORE_HEALTH). Conditionals may
 * also be reversed to check if the player does meet certain requirement.
 */
export enum Conditional {
  /** Check if the player has X or more hearts. */
  PLAYER_HAS_X_OR_MORE_HEALTH,

  /** Check if the player has X or more coins. */
  PLAYER_HAS_X_OR_MORE_COINS,

  /** Check if the player has X or more bombs. */
  PLAYER_HAS_X_OR_MORE_BOMBS,

  /** Check if the player has X or more keys. */
  PLAYER_HAS_X_OR_MORE_KEYS,

  /** Check if the player has X or more collectibles. */
  PLAYER_HAS_X_OR_MORE_COLLECTIBLES,

  /** Check if the player has X transformation (X is TransformationType). */
  PLAYER_HAS_TRANSFORMATION_X,

  /** Check if the player is holding a trinket (not including gulped). */
  PLAYER_HOLDING_TRINKET,

  /** Check if the player is holding the trinket X (X is TrinketType). */
  PLAYER_HAS_TRINKET_X,

  /** Check if the player is holding a pill. */
  PLAYER_HOLDING_PILL,

  /** Check if the player is holding the pill X (X is PillType). */
  PLAYER_HOLDING_PILL_X,

  /** Check if the player is holding a card. */
  PLAYER_HOLDING_CARD,

  /** Check if the player is holding the card X (X is CardType). */
  PLAYER_HOLDING_CARD_X,

  /** Check if the player has an active item. */
  PLAYER_HAS_ACTIVE_ITEM,

  /** Check if the player has the collectible X (X is CollectibleType). */
  PLAYER_HAS_COLLECTIBLE_X,

  /** Check if the player is in room X (X is RoomType). */
  PLAYER_IS_IN_ROOM_X,

  /** Check if the player is on floor X (X is levelStage). */
  PLAYER_IS_ON_FLOOR_X,

  /** Check if the player is on character X (X is CharacterType). */
  PLAYER_IS_CHARACTER_X,

  /** If player is on the left side of the room. */
  PLAYER_IS_ON_LEFT_SIDE_OF_ROOM,

  /** If the player is on exactly X health (X is a number constituting half a heart). */
  PLAYER_IS_ON_X_HEALTH,

  /** If player has X heart type (X is HeartType). */
  PLAYER_HAS_X_HEART_TYPE,

  /** If the world is in its inverted state. */
  WORLD_IS_INVERTED,

  /** If the world is X. (X is WorldVariant). */
  WORLD_IS_X,

  /** If the difficulty is X (X is Difficulty). */
  IS_DIFFICULTY_X,

  /** If there are enemies in the room (room isn't clear). */
  ROOM_HAS_ENEMIES,

  /** If the room has any pickups. */
  ROOM_HAS_PICKUPS,

  /** If the room has any obstacles. */
  ROOM_HAS_OBSTACLES,

  /** If the player is moving (velocity is not 0). */
  PLAYER_IS_MOVING,

  /** If the player has flight. */
  PLAYER_IS_FLYING,

  /** If the day is X (X is Day enum). */
  IS_DAY_X,

  /** If it's holiday X (X is Holiday enum). */
  IS_HOLIDAY,

  /** If the floor has a curse. */
  FLOOR_IS_CURSED,

  /** If the player only has hearts of X type (Where X is HeartType). */
  PLAYER_HAS_ONLY_X_HEARTS,
}
