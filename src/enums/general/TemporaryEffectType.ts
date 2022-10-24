/** Dictates how long various effects affect the player or other beings. */
export enum TemporaryEffectType {
  /** Lasts until you exit the room. */
  ROOM,
  /** Lasts for the level. */
  LEVEL,
  /** Lasts until you are hit. */
  ON_HIT,
}
