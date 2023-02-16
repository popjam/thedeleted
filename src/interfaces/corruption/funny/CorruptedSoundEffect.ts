import { SoundEffect } from "isaac-typescript-definitions";

/**
 * A serializable object containing information for a corrupted sound effect - these sound effects
 * may contain multiple sound effects that are played in order.
 */
export interface CorruptedSoundEffect {
  /**
   * The sound effects to play, this will be in order. Can either be a SoundEffect for default
   * volume, pitch and delay or a SoundEffectOptions object. The secondary number in the tuple is
   * the length of the sound effect in seconds. Leave it as 0 if you don't know. Can be a decimal.
   * Can be a range of numbers, in which case a random time will be chosen in milliseconds.
   */
  soundEffects: Array<[SoundEffect, number]>;
}
