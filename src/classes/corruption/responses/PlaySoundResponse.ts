import type { SoundEffect } from "isaac-typescript-definitions";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import type { SoundEffectOptions } from "../../../interfaces/general/SoundEffectOptions";
import {
  getRandomSoundEffect,
  playSoundEffectWithOptions,
} from "../../../helper/soundHelper";
import { sfxManager } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { NEUTRAL_SEVERITY } from "../../../constants/severityConstants";
import { getSoundNameFromSoundEffectID } from "../../../features/data/gameSets/gameSets";

const VERB = "play";
const VERB_PARTICIPLE = "playing";

/**
 * Response to play a sound effect.
 *
 * @example 'Play the sound effect "Isaac Hurt"'.
 *
 * @field s The sound effect to play.
 */
export class PlaySoundResponse extends Response {
  override responseType = ResponseType.PLAY_SOUND;
  s?: SoundEffect | SoundEffectOptions | undefined;

  override construct(sound: SoundEffect | SoundEffectOptions): this {
    this.s = sound;
    return this;
  }

  /** Sounds have no consequences. */
  override getSeverity(): number {
    return NEUTRAL_SEVERITY;
  }

  getSoundEffect(): SoundEffect | SoundEffectOptions | undefined {
    return this.s;
  }

  setSoundEffect(sound: SoundEffect | SoundEffectOptions | undefined): this {
    this.s = sound;
    return this;
  }

  playSoundEffect(): SoundEffect {
    const soundEffect = this.getSoundEffect();
    if (soundEffect === undefined) {
      // Play a random sound effect.
      const randomSoundEffect = getRandomSoundEffect();
      sfxManager.Play(randomSoundEffect);
      return randomSoundEffect;
    }

    if (typeof soundEffect === "number") {
      // Play the sound effect.
      sfxManager.Play(soundEffect);
      return soundEffect;
    }

    playSoundEffectWithOptions(soundEffect);
    return soundEffect.soundEffect;
  }

  /**
   * Get noun text with amount of activations.
   *
   * @returns The noun text.
   *
   * TODO: Add sfx icon.
   */
  override getNoun(_eid: boolean): string {
    const soundEffect = this.getSoundEffect();
    if (soundEffect === undefined) {
      return "a random sound effect";
    }

    if (typeof soundEffect === "number") {
      return getSoundNameFromSoundEffectID(soundEffect);
    }

    return getSoundNameFromSoundEffectID(soundEffect.soundEffect);
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getText(eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun(eid);

    return `${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): SoundEffect[] {
    return super.trigger(triggerData) as SoundEffect[];
  }

  override fire(_triggerData: TriggerData): SoundEffect {
    return this.playSoundEffect();
  }
}
