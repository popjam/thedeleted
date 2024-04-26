import type { SoundEffect } from "isaac-typescript-definitions";
import { getRandomSetElement, sfxManager } from "isaacscript-common";
import { PICKUP_SOUNDS } from "../constants/soundConstants";
import type { SoundEffectOptions } from "../interfaces/general/SoundEffectOptions";
import { getSoundEffectIDSet } from "../features/data/gameSets/gameSets";

/**
 * Stops the sounds that run after picking up any sort of item. You may need to run this in the next
 * game frame instead of the callback you are in.
 */
export function stopPickupSounds(): void {
  for (const sound of PICKUP_SOUNDS) {
    sfxManager.Stop(sound as SoundEffect);
  }
}

/**
 * Returns a random sound effect. Includes modded sound effects.
 *
 * @returns {SoundEffect} A random sound effect.
 */
export function getRandomSoundEffect(): SoundEffect {
  return getRandomSetElement(getSoundEffectIDSet(), undefined);
}

/** Play a sound effect using a SoundEffectOptions object. */
export function playSoundEffectWithOptions(
  soundEffectOptions: SoundEffectOptions,
): void {
  const { soundEffect, volume, pitch, frameDelay, loop, pan } =
    soundEffectOptions;
  sfxManager.Play(soundEffect, volume, frameDelay, loop, pitch, pan);
}
