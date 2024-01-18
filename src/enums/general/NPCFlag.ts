/**
 * Custom NPC flags to modify the NPC's behavior or appearance. There are no non-Custom NPC flags,
 * instead 'EntityFlags' are used for general modification between NPCs and other entities. NPCFlag
 * may include some of these existing flags, which will guarantee that it will work on NPCs.
 */
export enum NPCFlag {
  /** Prevents an NPC from moving. It can still be damaged and attack the player. */
  BOLSTERED,

  /** Custom freeze an enemy, to stop them from moving or attacking. */
  FROZEN,

  /** Makes an NPC not be required to kill to clear a room. */
  NON_MANDATORY,

  /** Obstructs an enemies appearance by censoring them and things they spawn. */
  CENSORED,

  /** The NPC will explode after a random period of time. */
  UNSTABLE,

  /** Existing Flags. */

  /**
   * Existing fear status effect. This effect will be permanently applied until the NPC dies or the
   * player leaves the game.
   */
  FEAR,

  /**
   * Existing burn status effect. This effect will be permanently applied until the NPC dies or the
   * player leaves the game.
   */
  BURN,

  /**
   * Existing charmed status effect. This effect will be permanently applied until the NPC dies or
   * the player leaves the game.
   */
  CHARMED,

  /**
   * Existing confused status effect. This effect will be permanently applied until the NPC dies or
   * the player leaves the game.
   */
  CONFUSED,

  /**
   * Existing frozen status effect. This effect will be permanently applied until the NPC dies or
   * the player leaves the game.
   */
  ICE_FREEZE,

  /**
   * Existing midas freeze status effect. This effect will be permanently applied until the NPC dies
   * or the player leaves the game.
   */
  MIDAS_FREEZE,

  /**
   * Existing poison status effect. This effect will be permanently applied until the NPC dies or
   * the player leaves the game.
   */
  POISONED,

  /**
   * Existing shrink status effect. This effect will be permanently applied until the NPC dies or
   * the player leaves the game.
   */
  SHRUNKEN,

  /**
   * Existing slowing status effect. This effect will be permanently applied until the NPC dies or
   * the player leaves the game.
   */
  SLOWING,

  /** Friendly ball NPC that persists between rooms and floors. */
  FRIENDLY,

  /** Persists between rooms and floors. TODO: Support leave/continue. */
  PERSISTENT,

  // TODO:

  // STONE_SHOOTER - NPC will be a stone shooter, shooting out NPCs of the same type which disappear
  // after a few seconds and have reduced HitPoints. The stone shooter is unable to move or be
  // attacked.

  // PERMANENT - NPC will stay in one room until killed.

  // GLASS - Similar to an iced enemy, but works with bosses.

  // STONE - NPC will behave similar to a stoney, unable to hurt the player but also unable to be
  // hurt by the player.

  // SLIPPERY - NPC will slide around the room, as if they were on ice.

  // HONEY - NPC will have reduced momentum, as if they were on honey.

  // HIBERNATING - NPC will be permanent and non-mandatory, and will be 'asleep', unable to move or
  // attack. They will be woken up if an enemy or player gets too close, removing their
  // non-mandatory status.

  // NIGHTMARE - Upon being touched by this enemy, the player will be teleported to a nightmare.

  // OVERCLOCKED - Sped up.

  // INVISIBLE - Invisible.
}
