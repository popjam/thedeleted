import { SoundEffect } from "isaac-typescript-definitions";
import { getRandomEnumValue, sfxManager } from "isaacscript-common";

const PICKUP_SOUNDS = [
  SoundEffect.POWER_UP_1,
  SoundEffect.POWER_UP_2,
  SoundEffect.POWER_UP_3,
  SoundEffect.CHOIR_UNLOCK,
] as const;

/**
 * Stops the sounds that run after picking up any sort of item. You may need to run this in the next
 * game frame instead of the callback you are in.
 */
export function stopPickupSounds(): void {
  PICKUP_SOUNDS.forEach((sound) => {
    sfxManager.Stop(sound);
  });
}

export function getRandomSoundEffect(): SoundEffect {
  return getRandomEnumValue(SoundEffect);
}
