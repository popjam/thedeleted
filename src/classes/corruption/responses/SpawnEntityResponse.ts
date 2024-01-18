import {
  VectorZero,
  getRandomSetElement,
  spawnEntityID,
} from "isaacscript-common";
import type { EntityID } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { EntityCategory } from "../../../enums/general/EntityCategory";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import {
  getEntityIDSet,
  getEntityIDSetFromCategory,
} from "../../../features/data/gameSets/gameEntitySets";
import type { SpawnEntityResponseInterface } from "../../../interfaces/corruption/responses/SpawnEntityResponseInterface";
import { getRandomPosition } from "../../../helper/positionHelper";
import { entityCategoryToString } from "../../../maps/data/name/entityCategoryNameMap";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import { getEntityIDName } from "../../../helper/entityHelper/entityIDNameHelper";

const VERB = "spawn";
const VERB_PARTICIPLE = "spawning";
const UNKNOWN_ENTITY = "mysterious entity";

/**
 * Response to spawn a non-Grid entity. Note that you should probably use the specific
 * EntityCategory's SpawnResponse instead (e.g SpawnNPCResponse).
 *
 * @param e The Entity to spawn. If undefined, will spawn a random Entity.
 * @param sp The overridden position the entity will spawn at. If undefined, will spawn at a random
 *           position.
 * @param v The overridden velocity the entity will spawn with. If undefined, will spawn with a
 *          random velocity.
 */
export class SpawnEntityResponse
  extends Response
  implements SpawnEntityResponseInterface<SpawnEntityResponse>
{
  override responseType: ResponseType = ResponseType.SPAWN_ENTITY;
  e?: EntityID | EntityCategory;
  sp?: Vector | undefined;
  v?: Vector | undefined;

  /**
   * Response to spawn a non-Grid entity. Note that you should probably use the specific
   * EntityCategory's SpawnResponse instead (e.g SpawnNPCResponse).
   *
   * @param entity The Entity to spawn. If undefined, will spawn a random Entity.
   * @param overridePos The overridden position the entity will spawn at. If undefined, will spawn
   *                    at a random position.
   * @param overrideVel The overridden velocity the entity will spawn with. If undefined, will spawn
   *                    with a random velocity.
   */
  override construct(
    entity: EntityID | EntityCategory | undefined,
    overridePos?: Vector,
    overrideVel?: Vector,
  ): this {
    this.setEntity(entity);
    this.setPosition(overridePos);
    this.setVelocity(overrideVel);
    return this;
  }

  setEntity(entity: EntityID | EntityCategory | undefined): this {
    this.e = entity;
    return this;
  }

  getEntity(): EntityID | EntityCategory | undefined {
    return this.e;
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
    const position = this.getPosition();
    if (position !== undefined) {
      return position;
    }

    return triggerData.spawnPosition ?? getRandomPosition();
  }

  calculateVelocity(triggerData: TriggerData): Vector {
    const velocity = this.getVelocity();
    if (velocity !== undefined) {
      return velocity;
    }

    return triggerData.spawnVelocity ?? VectorZero;
  }

  calculateEntity(): EntityID {
    const entityID = this.getEntity();

    // Random entity.
    if (entityID === undefined) {
      return getRandomSetElement(getEntityIDSet(), undefined);
    }

    // Specific entity.
    if (typeof entityID === "string") {
      return entityID;
    }

    // Entity category.
    return getRandomSetElement(getEntityIDSetFromCategory(entityID), undefined);
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "a random entity"
   * @example "3 random entities"
   * @example "a random npc"
   * @example "3 random npcs"
   * @example "a fart"
   */
  override getNoun(_eid: boolean): string {
    const entityID = this.getEntity();
    const isMultiple = this.isMultiple();

    // Random entity.
    if (entityID === undefined) {
      if (isMultiple) {
        return `${this.getAmountOfActivationsText()} random entities`;
      }
      return "a random entity";
    }

    // Entity category.
    if (typeof entityID === "number") {
      if (isMultiple) {
        return `${this.getAmountOfActivationsText()} random ${addTheS(
          entityCategoryToString(entityID),
          true,
        )}`;
      }
      return `a random ${entityCategoryToString(entityID).toLowerCase()}`;
    }

    // Specific entity.
    if (isMultiple) {
      return `${this.getAmountOfActivationsText()} ${addTheS(
        getEntityIDName(entityID) ?? UNKNOWN_ENTITY,
        true,
      )}`;
    }

    return addArticle(getEntityIDName(entityID) ?? UNKNOWN_ENTITY);
  }

  override getText(eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun(eid);

    return `${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): Entity[] {
    return super.trigger(triggerData) as Entity[];
  }

  override fire(triggerData: TriggerData): Entity {
    const entityID = this.calculateEntity();
    const position = this.calculatePosition(triggerData);
    const velocity = this.calculateVelocity(triggerData);
    return spawnEntityID(entityID, position, velocity);
  }
}
