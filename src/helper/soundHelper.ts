import { SoundEffect } from "isaac-typescript-definitions";
import { getRandomEnumValue, sfxManager } from "isaacscript-common";
import { PICKUP_SOUNDS } from "../constants/soundConstants";
import type { SoundEffectOptions } from "../interfaces/general/SoundEffectOptions";

/**
 * Stops the sounds that run after picking up any sort of item. You may need to run this in the next
 * game frame instead of the callback you are in.
 */
export function stopPickupSounds(): void {
  for (const sound of PICKUP_SOUNDS) {
    sfxManager.Stop(sound as SoundEffect);
  }
}

export function getRandomSoundEffect(): SoundEffect {
  return getRandomEnumValue(SoundEffect, undefined);
}

/** Play a sound effect using a SoundEffectOptions object. */
export function playSoundEffectWithOptions(
  soundEffectOptions: SoundEffectOptions,
): void {
  const { soundEffect, volume, pitch, frameDelay, loop, pan } =
    soundEffectOptions;
  sfxManager.Play(soundEffect, volume, frameDelay, loop, pitch, pan);
}
