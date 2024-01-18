import type { SoundEffect } from "isaac-typescript-definitions";

/** Describes a sound effect and its settings. */
export interface SoundEffectOptions {
  /** The sound effect to play. */
  soundEffect: SoundEffect;

  /** The volume of the sound effect. */
  volume?: number;

  /** The pitch of the sound effect. */
  pitch?: number;

  /** The delay before the sound effect is played. */
  frameDelay?: number;

  /** Whether to loop the sound effect. */
  loop?: boolean;

  /** How much to pan the sound effect from L to R. */
  pan?: number;
}
