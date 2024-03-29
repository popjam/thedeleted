import type { EntityID } from "isaacscript-common";
import { getRandomSetElement, spawnEntityID } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import { getEntityIDSetFromCategory } from "../../../features/data/gameSets/gameSets";
import { EntityCategory } from "../../../enums/general/EntityCategory";
import type { TearVariant } from "isaac-typescript-definitions";
import { EntityType } from "isaac-typescript-definitions";
import { addArticle } from "../../../helper/stringHelper";
import { getRandomPosition } from "../../../helper/positionHelper";
import type { SpawnEntityResponseInterface } from "../../../interfaces/corruption/responses/SpawnEntityResponseInterface";
import { getEntityNameFromEntityID } from "../../../helper/entityHelper/entityIDHelper";

const VERB = "spawn";
const VERB_PARTICIPLE = "spawning";
const DEFAULT_SPAWN_VELOCITY = Vector(0, 0);
const UNKNOWN_TEAR_NAME_TEXT = "mysterious tear";

/** Response to spawn a Tear. */
export class SpawnTearResponse
  extends Response
  implements SpawnEntityResponseInterface<SpawnTearResponse>
{
  override responseType: ResponseType = ResponseType.SPAWN_TEAR;
  e?: TearVariant | undefined;
  sp?: Vector;
  v?: Vector;

  construct(
    tear?: TearVariant,
    overridePos?: Vector,
    overrideVel?: Vector,
  ): this {
    if (tear !== undefined) {
      this.setTear(tear);
    }
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (overrideVel !== undefined) {
      this.setVelocity(overrideVel);
    }
    return this;
  }

  getTear(): TearVariant | undefined {
    return this.e;
  }

  setTear(tear: TearVariant): this {
    this.e = tear;
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

  calculateTear(): EntityID {
    const tear = this.getTear();
    if (tear !== undefined) {
      return `${EntityType.TEAR}.${tear}.0` as EntityID;
    }

    // Random Slot.
    const tears = getEntityIDSetFromCategory(EntityCategory.TEAR);
    return getRandomSetElement<EntityID>(tears, undefined);
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "a random tear"
   * @example "3-4 booger tears"
   */
  getNoun(): string {
    const tear = this.getTear();
    const isMultiple = this.isMultiple();
    if (tear === undefined) {
      // Random tears.
      if (isMultiple) {
        return `${this.getAmountOfActivationsText()} random tears`;
      }

      return "a random tear";
    }

    // Specific tear.
    const name =
      getEntityNameFromEntityID(
        `${EntityType.TEAR}.${tear}.0` as EntityID,
      )?.toLowerCase() ?? UNKNOWN_TEAR_NAME_TEXT;
    if (isMultiple) {
      return `${this.getAmountOfActivationsText()} ${tear} tears`;
    }

    return `${addArticle(name)} tear`;
  }

  getText(_eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun();

    return `${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): EntityTear[] {
    return super.trigger(triggerData) as EntityTear[];
  }

  fire(triggerData: TriggerData): EntityTear {
    const position = this.calculatePosition(triggerData);
    const velocity = this.calculateVelocity(triggerData);
    const slot = this.calculateTear();

    return spawnEntityID(slot, position, velocity) as EntityTear;
  }
}
