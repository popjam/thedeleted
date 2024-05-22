import type { BombVariant } from "isaac-typescript-definitions";
import { EntityType } from "isaac-typescript-definitions";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import type { EntityID } from "isaacscript-common";
import {
  getRandomInt,
  getRandomSetElement,
  getRandomVector,
  spawnEntityID,
} from "isaacscript-common";
import { EntityCategory } from "../../../enums/general/EntityCategory";
import { getEntityCategoryFromEntityID } from "../../../helper/entityHelper/entityIDHelper";
import { getEntityIDSetFromCategory } from "../../../features/data/gameSets/gameSets";
import { getRandomPosition } from "../../../helper/positionHelper";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import type { SpawnEntityResponseInterface } from "../../../interfaces/corruption/responses/SpawnEntityResponseInterface";

const DEFAULT_BOMB_SUBTYPE = 0;
const MINIMUM_SPEED = 0;
const MAXIMUM_SPEED = 40;
const VERB = "spawn";
const VERB_PARTICIPLE = "spawning";
const UNKNOWN_BOMB_NAME = "mysterious bomb";

/**
 * Response to spawn a live bomb.
 *
 * @param lb Bomb variant to spawn.
 * @param sp The position to spawn the bomb at. If not specified, will spawn at a random position.
 * @param v The velocity to spawn the bomb with. If not specified, will spawn with a random
 *          velocity.
 */
export class SpawnLiveBombResponse
  extends Response
  implements SpawnEntityResponseInterface<SpawnLiveBombResponse>
{
  override responseType: ResponseType = ResponseType.SPAWN_LIVE_BOMB;
  lb?: EntityID;
  sp?: Vector;
  v?: Vector;

  override construct(
    bombVariantOrEntityID?: BombVariant | EntityID,
    subType?: number,
    overridePos?: Vector,
    overrideVel?: Vector,
  ): this {
    if (bombVariantOrEntityID !== undefined) {
      this.setBomb(bombVariantOrEntityID, subType);
    }
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (overrideVel !== undefined) {
      this.setVelocity(overrideVel);
    }
    return this;
  }

  /** Get the live bomb to spawn. If undefined, will spawn a random bomb. */
  getBomb(): EntityID | undefined {
    return this.lb;
  }

  /**
   * Set the live bomb to spawn. If bombVariantOrEntityID is a bomb EntityID, will spawn that
   * EntityID. If bombVariantOrEntityID is a BombVariant, will spawn that bomb variant with the
   * provided subType, or 0 if subType is undefined. If bombVariantOrEntityID is undefined, will
   * spawn a random bomb.
   */
  setBomb(
    bombVariantOrEntityID?: BombVariant | EntityID,
    subType?: number,
  ): this {
    if (bombVariantOrEntityID === undefined) {
      this.lb = undefined;
      return this;
    }

    if (typeof bombVariantOrEntityID === "string") {
      if (
        getEntityCategoryFromEntityID(bombVariantOrEntityID) !==
        EntityCategory.BOMB
      ) {
        error(`EntityID '${bombVariantOrEntityID}' is not a bomb!`);
      }
      this.lb = bombVariantOrEntityID;
      return this;
    }

    const entityID = `${EntityType.BOMB}.${bombVariantOrEntityID}.${
      subType ?? DEFAULT_BOMB_SUBTYPE
    }` as EntityID;
    this.lb = entityID;
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

  calculateVelocity(_triggerData: TriggerData): Vector {
    const overrideVel = this.getVelocity();
    if (overrideVel !== undefined) {
      return overrideVel;
    }

    // We get a random velocity.
    const direction = getRandomVector(undefined);
    const speed = getRandomInt(MINIMUM_SPEED, MAXIMUM_SPEED, undefined);
    return direction.mul(speed);
  }

  // TODO: Implement random bomb spawning.
  calculateBomb(): EntityID {
    return (
      this.lb ??
      getRandomSetElement(
        getEntityIDSetFromCategory(EntityCategory.BOMB),
        undefined,
      )
    );
  }

  /**
   * Get noun text.
   *
   * @example "a random live bomb"
   * @example "3-4 live bobby bombs"
   */
  getNoun(): string {
    const bomb = this.getBomb();
    const isMultiple = this.isMultiple();
    if (bomb === undefined) {
      return isMultiple
        ? `${this.getAmountOfActivationsText()} random live bombs`
        : "a random live bomb";
    }

    const bombName = "FUCK OFF";
    return isMultiple
      ? `${this.getAmountOfActivationsText()} live ${addTheS(bombName, true)}`
      : addArticle(bombName);
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getText(_eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun();
    const chanceToActivate = this.getChanceToActivateText(participle);

    return `${chanceToActivate} ${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): EntityBomb[] {
    return super.trigger(triggerData) as EntityBomb[];
  }

  override fire(triggerData: TriggerData): EntityBomb {
    const bombEntityID = this.calculateBomb();
    const player = triggerData.player ?? Isaac.GetPlayer(0);
    const position = this.calculatePosition(triggerData);
    const velocity = this.calculateVelocity(triggerData);

    return spawnEntityID(
      bombEntityID,
      position,
      velocity,
      player,
    ) as EntityBomb;
  }
}
