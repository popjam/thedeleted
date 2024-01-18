import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import { EffectID } from "../../../enums/data/ID/EffectID";
import {
  getEffectIDName,
  getRandomEffectID,
} from "../../../helper/entityHelper/effectIDHelper";
import { getIncludeModdedEffectsInGenerationSetting } from "../../../features/settings/ModdedEffectSettings";
import { spawnEffectID } from "../../../helper/entityHelper/effectHelper";
import { getRandomPosition } from "../../../helper/positionHelper";
import type { SpawnEntityResponseInterface } from "../../../interfaces/corruption/responses/SpawnEntityResponseInterface";

const VERB = "spawn";
const VERB_PARTICIPLE = "spawning";
const DEFAULT_SPAWN_VELOCITY = Vector(0, 0);
const UNKNOWN_TEAR_NAME_TEXT = "mysterious effect";
const DEFAULT_EFFECT = EffectID.FART;

/** Response to spawn an Effect. */
export class SpawnEffectResponse
  extends Response
  implements SpawnEntityResponseInterface<SpawnEffectResponse>
{
  override responseType: ResponseType = ResponseType.SPAWN_EFFECT;
  e?: EffectID | undefined;
  sp?: Vector;
  v?: Vector;

  construct(
    effect?: EffectID,
    overridePos?: Vector,
    overrideVel?: Vector,
  ): this {
    if (effect !== undefined) {
      this.setEffect(effect);
    }
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (overrideVel !== undefined) {
      this.setVelocity(overrideVel);
    }
    return this;
  }

  getEffect(): EffectID | undefined {
    return this.e;
  }

  setEffect(effect: EffectID): this {
    this.e = effect;
    return this;
  }

  getPosition(): Vector | undefined {
    return this.sp;
  }

  setPosition(position?: Vector): this {
    this.sp = position;
    return this;
  }

  getVelocity(): Vector | undefined {
    return this.v;
  }

  setVelocity(velocity?: Vector): this {
    this.v = velocity;
    return this;
  }

  calculatePosition(triggerData: TriggerData): Vector {
    return (
      this.getPosition() ?? triggerData.spawnPosition ?? getRandomPosition()
    );
  }

  calculateVelocity(triggerData: TriggerData): Vector {
    return triggerData.spawnVelocity ?? DEFAULT_SPAWN_VELOCITY;
  }

  calculateEffect(): EffectID {
    const effect = this.getEffect();
    if (effect !== undefined) {
      return effect;
    }
    const moddedEffectSetting = getIncludeModdedEffectsInGenerationSetting();
    // Random Effect.
    return (
      getRandomEffectID(moddedEffectSetting ? undefined : false) ??
      DEFAULT_EFFECT
    );
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "a random effect".
   * @example "a fart"
   * @example "50 farts"
   */
  override getNoun(): string {
    const effect = this.getEffect();
    const isMultiple = this.isMultiple();
    if (effect === undefined) {
      // Random effect.
      if (isMultiple) {
        return `${this.getAmountOfActivationsText()} random effects`;
      }

      return "a random effect";
    }

    // Specific effect.
    const name =
      getEffectIDName(effect)?.toLowerCase() ?? UNKNOWN_TEAR_NAME_TEXT;
    if (isMultiple) {
      return `${this.getAmountOfActivationsText()} ${addTheS(effect, true)}`;
    }

    return `${addArticle(name)}`;
  }

  getText(_eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun();

    return `${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): EntityEffect[] {
    return super.trigger(triggerData) as EntityEffect[];
  }

  fire(triggerData: TriggerData): EntityEffect {
    const position = this.calculatePosition(triggerData);
    const velocity = this.calculateVelocity(triggerData);
    const effect = this.calculateEffect();

    return spawnEffectID(effect, position, velocity);
  }
}
