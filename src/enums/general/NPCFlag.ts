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
}
