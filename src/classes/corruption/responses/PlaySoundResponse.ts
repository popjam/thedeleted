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
  s?: SoundEffect | SoundEffectOptions;

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

  setSoundEffect(sound: SoundEffect | SoundEffectOptions): this {
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

    // Why the fuck does this not filter out undefined?
    playSoundEffectWithOptions(soundEffect);
    return soundEffect.soundEffect;
  }

  // TODO.
  override getNoun(): string {
    return "";
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getText(_eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun();

    return `${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): SoundEffect[] {
    return super.trigger(triggerData) as SoundEffect[];
  }

  override fire(_triggerData: TriggerData): SoundEffect {
    return this.playSoundEffect();
  }
}
