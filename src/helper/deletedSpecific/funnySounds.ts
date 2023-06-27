/** This file contains functions used to create glitched sound effects. */

import { SoundEffect } from "isaac-typescript-definitions";
import { GAME_FRAMES_PER_SECOND, sfxManager } from "isaacscript-common";
import {
  DEFAULT_CORRUPTED_SOUND_EFFECT_AMOUNT,
  DEFAULT_CORRUPTED_SOUND_EFFECT_LENGTH,
} from "../../constants/corruptionConstants";
import { MILLISECONDS_IN_A_SECOND } from "../../constants/generalConstants";
import { CorruptedSoundEffect } from "../../interfaces/corruption/funny/CorruptedSoundEffect";
import { mod } from "../../mod";
import {
  Range,
  multiplyRangeConstituents,
  randomInRange,
  randomInRangeOrNumber,
} from "../../types/general/Range";
import { getRandomSoundEffect } from "../soundHelper";

/**
 * Generates a random soundEffect in the form of 'CorruptedSoundEffect'. This object can then be
 * passed to the 'playCorruptedSound' function. Alternatively, you can use the
 * 'playRandomCorruptedSound'.
 *
 * @param amountOfSoundEffects The amount of sound effects to play. Can be a range of numbers, in
 *                             which case a random amount will be chosen.
 * @param lengthInSeconds The length of the corrupted sound effect in seconds. Can be a range of
 *                        numbers, in which case a random time will be chosen in milliseconds. Can
 *                        be a decimal.
 */
export function generateCorruptedSound(
  amountOfSoundEffects: number | Range = DEFAULT_CORRUPTED_SOUND_EFFECT_AMOUNT,
  lengthInSeconds: number | Range = DEFAULT_CORRUPTED_SOUND_EFFECT_LENGTH,
): CorruptedSoundEffect {
  const soundEffects: Array<[SoundEffect, number]> = [];

  /**
   * We need to convert the range to milliseconds, find a random value, then convert it back to
   * seconds.
   */
  if (typeof lengthInSeconds !== "number") {
    lengthInSeconds =
      randomInRangeOrNumber(
        multiplyRangeConstituents(lengthInSeconds, MILLISECONDS_IN_A_SECOND),
      ) / MILLISECONDS_IN_A_SECOND;
  }

  const amount = randomInRangeOrNumber(amountOfSoundEffects);
  for (let i = 0; i < amount; i++) {
    const soundEffect = getRandomSoundEffect();
    soundEffects.push([soundEffect, lengthInSeconds / amount]);
  }
  return { soundEffects };
}

export function playCorruptedSound(
  corruptedSound: CorruptedSoundEffect,
  volume = 1,
  pitch = 1,
): void {
  let delay = 0;
  let currentlyPlaying: SoundEffect | undefined;
  for (const [soundEffect, lengthInSeconds] of corruptedSound.soundEffects) {
    mod.runInNGameFrames(() => {
      /** Stop previous sound. */
      if (currentlyPlaying !== undefined) {
        sfxManager.Stop(currentlyPlaying);
      }

      sfxManager.Play(
        soundEffect,
        volume,
        undefined,
        undefined,
        randomInRange([
          0.8 * MILLISECONDS_IN_A_SECOND,
          1.2 * MILLISECONDS_IN_A_SECOND,
        ]) / MILLISECONDS_IN_A_SECOND,
      );
      currentlyPlaying = soundEffect;
    }, delay * GAME_FRAMES_PER_SECOND);
    delay += lengthInSeconds;
  }
  mod.runInNGameFrames(() => {
    /** Stop final sound. */
    if (currentlyPlaying !== undefined) {
      sfxManager.Stop(currentlyPlaying);
    }
  }, delay * GAME_FRAMES_PER_SECOND);
}
