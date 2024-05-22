import type { EntityID } from "isaacscript-common";
import {
  getConstituentsFromEntityID,
  getEntities,
  getRandomArrayElementAndRemove,
} from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { Response } from "./Response";
import type { EntityCategory } from "../../../enums/general/EntityCategory";
import { getAllEntitiesWithCategory } from "../../../helper/entityHelper";
import { entityCategoryToString } from "../../../maps/data/name/entityCategoryNameMap";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import {
  getEntitiesFromEntityID,
  getEntityNameFromEntityID,
} from "../../../helper/entityHelper/entityIDHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { fprint } from "../../../helper/printHelper";

const VERB = "remove";
const VERB_PARTICIPLE = "removing";
const UNKNOWN_ENTITY_NAME = "mysterious entity";
const RANDOM_ENTITY_NAME = "random entity";

/**
 * Response to remove a random Entity.
 *
 * @example 'Remove a random Gaper'.
 * @example 'Remove all entities'.
 *
 * @param entity The Entity type that will be removed. This can be an EntityCategory (e.g 'Remove a
 *               random Projectile'), an EntityID (e.g 'Remove a Charged Key'), or undefined (remove
 *               any entity). Defaults to undefined. If the entity is an EntityID, you can specify
 *               '-1' as the subtype to remove a random entity of that type (e.g 'Remove a random
 *               Key').
 * @param removeAll If true, will remove all entities of the specified type rather than one.
 *                  Defaults to false.
 * @param ignoreFriendly If true, will ignore friendly NPCs. Defaults to false.
 *
 * This response will flatten all removed entities into a singular array, regardless of how many
 * activations it has or whether removeAll is true or false.
 */
export class RemoveEntityResponse extends Response {
  override responseType: ResponseType = ResponseType.REMOVE_ENTITY;
  e?: EntityCategory | EntityID;
  all?: boolean;
  iF?: true;

  construct(
    entity: EntityCategory | EntityID | undefined,
    removeAll: boolean,
    ignoreFriendly?: true,
  ): this {
    this.setEntity(entity);
    this.setRemoveAll(removeAll);
    this.iF = ignoreFriendly;
    return this;
  }

  /**
   * Get the Entity type that will be removed. This can be:
   * - A specific EntityID (e.g 'Remove a Charged Key').
   * - An EntityCategory (e.g 'Remove a random Projectile').
   * - An EntityID with '-1' as the subtype (e.g 'Remove a random Key').
   */
  getEntity(): EntityCategory | EntityID | undefined {
    return this.e;
  }

  /**
   * Set the Entity type that will be removed. This can be:
   * - A specific EntityID (e.g 'Remove a Charged Key').
   * - An EntityCategory (e.g 'Remove a random Projectile').
   * - An EntityID with '-1' as the subtype (e.g 'Remove a random Key').
   * - undefined (remove any entity).
   */
  setEntity(entityID?: EntityCategory | EntityID): this {
    this.e = entityID;
    return this;
  }

  /** Whether to not remove friendly NPCs. */
  getIgnoreFriendly(): boolean {
    return this.iF ?? false;
  }

  /** Whether to not remove friendly NPCs. */
  setIgnoreFriendly(ignoreFriendly: boolean): this {
    this.iF = ignoreFriendly ? true : undefined;
    return this;
  }

  /** Whether to remove all the entities of the specified type. */
  getRemoveAll(): boolean {
    return this.all ?? false;
  }

  /** Whether to remove all the entities of the specified type. */
  setRemoveAll(removeAll: boolean): this {
    this.all = removeAll;
    return this;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "3-4 random entities".
   * @example "a random entity".
   * @example "a random gaper".
   * @example "all enemies".
   */
  override getNoun(_eid: boolean): string {
    const entityID = this.getEntity();
    const isMultiple = this.isMultiple();
    const isAll = this.getRemoveAll();
    if (typeof entityID === "string") {
      const [entityType] = getConstituentsFromEntityID(entityID);

      if ((entityType as number) === -1) {
        if (isAll) {
          return "all entities";
        }
        if (isMultiple) {
          return `${this.getAmountOfActivationsText()} random entities`;
        }
        return `a ${RANDOM_ENTITY_NAME}`;
      }

      // TODO: Add support for subType and variant being -1.

      if (isAll) {
        return `all ${addTheS(entityID, true)}`;
      }
      if (isMultiple) {
        return `${this.getAmountOfActivationsText()} random ${addTheS(
          entityID,
          true,
        )}`;
      }
      return addArticle(
        getEntityNameFromEntityID(entityID) ?? UNKNOWN_ENTITY_NAME,
      );
    }
    if (entityID === undefined) {
      if (isAll) {
        return "all entities";
      }
      if (isMultiple) {
        return `${this.getAmountOfActivationsText()} random entities`;
      }
      return `a ${RANDOM_ENTITY_NAME}`;
    }

    // It's a category.
    if (isAll) {
      return `all ${addTheS(
        entityCategoryToString(entityID).toLowerCase(),
        true,
      )}`;
    }
    if (isMultiple) {
      return `${this.getAmountOfActivationsText()} random ${addTheS(
        entityCategoryToString(entityID).toLowerCase(),
        true,
      )}`;
    }

    return `a random ${entityCategoryToString(entityID).toLowerCase()}`;
  }

  getText(eid: boolean, participle: boolean): string {
    const noun = this.getNoun(eid);
    const verb = this.getVerb(participle);
    const chanceToActivate = this.getChanceToActivateText(participle);

    return `${chanceToActivate} ${verb} ${noun}`;
  }

  getEntitiesToRemove(): Entity[] {
    const entityIDToRemove = this.getEntity();
    const ignoreFriendly = this.getIgnoreFriendly();

    // EntityID.
    if (typeof entityIDToRemove === "string") {
      return [...getEntitiesFromEntityID(entityIDToRemove, ignoreFriendly)];
    }

    // Category.
    if (typeof entityIDToRemove === "number") {
      return [...getAllEntitiesWithCategory(entityIDToRemove, ignoreFriendly)];
    }

    // Random.
    return [...getEntities()];
  }

  removeEntities(): Entity[] {
    const entitiesToRemove = this.getEntitiesToRemove();
    if (entitiesToRemove.length === 0) {
      fprint("RemoveEntityResponse: No entities to remove.");
      return [];
    }

    const amountToRemove = this.getRemoveAll()
      ? entitiesToRemove.length
      : this.calculateAmountOfActivations();

    // Remove the entities.
    const removedEntities: Entity[] = [];
    for (let i = 0; i < amountToRemove; i++) {
      const entityToRemove = getRandomArrayElementAndRemove(
        entitiesToRemove,
        undefined,
      );

      entityToRemove.Remove();
      removedEntities.push(entityToRemove);
    }

    return removedEntities;
  }

  override shouldFlattenResults(): boolean {
    return true;
  }

  override shouldSkipAmountOfActivations(): boolean {
    return true;
  }

  /** Override trigger() to flatten removed entities into a singular array. */
  override trigger(triggerData?: TriggerData): Entity[] {
    return super.trigger(triggerData) as Entity[];
  }

  fire(): Entity[] {
    return this.removeEntities();
  }
}
