import { SoundEffect } from "isaac-typescript-definitions";

/** Sound effects that play after picking up items on various types of pedestals. */
export const PICKUP_SOUNDS = [
  SoundEffect.POWER_UP_1,
  SoundEffect.POWER_UP_2,
  SoundEffect.POWER_UP_3,
  SoundEffect.CHOIR_UNLOCK,
  SoundEffect.DEVIL_ROOM_DEAL,
] as const;

// Not tested.
export const MAX_SOUND_EFFECT_PITCH = 10;
