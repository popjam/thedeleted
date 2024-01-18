import { VectorZero, isGridEntity } from "isaacscript-common";
import type { EntityID } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { EntityOrGridEntity } from "../../../types/general/EntityUnion";
import { RemoveEntityResponse } from "./RemoveEntityResponse";
import { Response } from "./Response";
import type { EntityCategory } from "../../../enums/general/EntityCategory";
import type { Range } from "../../../types/general/Range";
import { RemoveGridEntityResponse } from "./RemoveGridEntityResponse";
import type { GridID } from "../../../enums/data/ID/GridID";
import { SpawnGridEntityResponse } from "./SpawnGridEntityResponse";
import { SpawnEntityResponse } from "./SpawnEntityResponse";
import type { GridEntityType } from "isaac-typescript-definitions";

const VERB = "transform";
const VERB_PARTICIPLE = "transforming";
const EMPTY_RESPONSE_TEXT = "nothing";

/**
 * Response which transforms entities or grid-entities in the room into other entities or
 * grid-entities. This is done by quickly removing the entity, then spawning the new entity in its
 * place (with the same position and velocity).
 *
 * @example 'Transform a random coin into a spider'.
 * @example 'Transform all spiders into coins'.
 *
 * @param rer The response responsible for getting entities or grid entities that will be
 *            transformed.
 */
export class TransformResponse extends Response {
  override responseType: ResponseType = ResponseType.TRANSFORM;
  rer?: RemoveEntityResponse | RemoveGridEntityResponse;
  ser?: SpawnEntityResponse | SpawnGridEntityResponse;

  /**
   * Response which transforms entities or grid-entities in the room into other entities or
   * grid-entities. This is done by quickly removing the entity, then spawning the new entity in its
   * place (with the same position and velocity).
   *
   * @example 'Transform a random coin into a spider'.
   * @example 'Transform all spiders into coins'.
   *
   * @param entitiesToTransform The entities to remove for transformation. Can be a specific
   *                            EntityID, an EntityCategory, a GridID, GridEntityType, or a random
   *                            grid or entity. i.e { entity: EntityID.COIN }.
   * @param entitiesToTransformTo The entities to spawn for transformation. Can be a SpawnResponse ,
   *                              a GridEntityType, EntityID, GridID, EntityCategory or random grid
   *                              or entity. i.e { entity: EntityID.COIN }.
   * @param amountToTransform The amount of entities to transform. Leave undefined to transform all
   *                          entities of the type. If a RemoveEntityResponse is provided, this
   *                          parameter will be ignored.
   */
  override construct(
    entitiesToTransform:
      | RemoveEntityResponse
      | RemoveGridEntityResponse
      | { grid: GridEntityType | GridID | undefined }
      | { entity: EntityID | EntityCategory | undefined },
    entitiesToTransformTo:
      | SpawnEntityResponse
      | SpawnGridEntityResponse
      | { grid: GridEntityType | GridID | undefined }
      | { entity: EntityID | EntityCategory | undefined },
    amountToTransform: number | Range | undefined = undefined,
  ): this {
    this.setRemoveResponse(entitiesToTransform, amountToTransform);
    this.setSpawnResponse(entitiesToTransformTo);
    return this;
  }

  /** The response responsible for getting entities or grid entities that will be transformed. */
  getRemoveResponse():
    | RemoveEntityResponse
    | RemoveGridEntityResponse
    | undefined {
    return this.rer;
  }

  /**
   * The response responsible for getting entities or grid entities that will be transformed. Does
   * not DeepCopy!
   *
   * @param removeEntityResponse The response responsible for getting entities or grid entities that
   *                             will be transformed. Can be a specific EntityID (or an EntityID
   *                             with '-1' as the variant / subType for more generalized entities),
   *                             an EntityCategory, a RemoveEntityResponse, or a Response which
   *                             triggers a RemoveEntityResponse.
   * @param amountToTransform The amount of entities to transform. Leave undefined to transform all
   *                          entities of the type. If a RemoveEntityResponse is provided, this
   *                          parameter will be ignored. To modify the amount of entities to
   *                          transform while passing a RemoveEntityResponse, use the
   *                          setAmountOfActivations() method on the RemoveEntityResponse.
   */
  setRemoveResponse(
    removeEntityResponse:
      | RemoveEntityResponse
      | RemoveGridEntityResponse
      | { grid: GridEntityType | GridID | undefined }
      | { entity: EntityID | EntityCategory | undefined },
    amountToTransform: number | Range | undefined = undefined,
  ): this {
    if ("entity" in removeEntityResponse) {
      this.rer = this.generateNewRemoveEntityResponse(
        removeEntityResponse.entity,
        amountToTransform,
      );
      return this;
    }

    if ("grid" in removeEntityResponse) {
      this.rer = this.generateNewRemoveGridEntityResponse(
        removeEntityResponse.grid,
        amountToTransform,
      );
      return this;
    }

    this.rer = removeEntityResponse;
    return this;
  }

  generateNewRemoveEntityResponse(
    entityID: EntityID | EntityCategory | undefined,
    amountToTransform: number | Range | undefined,
  ): RemoveEntityResponse {
    const newRemoveEntityResponse = new RemoveEntityResponse();
    if (amountToTransform === undefined) {
      newRemoveEntityResponse.setRemoveAll(true);
    } else {
      newRemoveEntityResponse.setAmountOfActivations(amountToTransform);
    }

    return newRemoveEntityResponse.setEntity(entityID);
  }

  generateNewRemoveGridEntityResponse(
    gridEntity: GridID | GridEntityType | undefined,
    amountToTransform: number | Range | undefined,
  ): RemoveGridEntityResponse {
    const removeGridEntityResponse = new RemoveGridEntityResponse();
    removeGridEntityResponse.setGridEntity(gridEntity);
    if (amountToTransform === undefined) {
      removeGridEntityResponse.setRemoveAll(true);
    } else {
      removeGridEntityResponse.setAmountOfActivations(amountToTransform);
    }
    return removeGridEntityResponse;
  }

  /** The response responsible for spawning the transformed entity or grid entity. */
  getSpawnResponse():
    | SpawnEntityResponse
    | SpawnGridEntityResponse
    | undefined {
    return this.ser;
  }

  /** The response responsible for spawning the transformed entity or grid entity. */
  setSpawnResponse(
    spawnEntityResponse:
      | SpawnEntityResponse
      | SpawnGridEntityResponse
      | { grid: GridEntityType | GridID | undefined }
      | { entity: EntityID | EntityCategory | undefined },
  ): this {
    if ("entity" in spawnEntityResponse) {
      this.ser = this.generateNewSpawnEntityResponse(
        spawnEntityResponse.entity,
      );
      return this;
    }

    if ("grid" in spawnEntityResponse) {
      this.ser = this.generateNewSpawnGridEntityResponse(
        spawnEntityResponse.grid,
      );
      return this;
    }

    this.ser = spawnEntityResponse;
    return this;
  }

  generateNewSpawnEntityResponse(
    entityID: EntityID | EntityCategory | undefined,
  ): SpawnEntityResponse {
    const newSpawnEntityResponse = new SpawnEntityResponse();
    return newSpawnEntityResponse.setEntity(entityID);
  }

  generateNewSpawnGridEntityResponse(
    gridEntity: GridID | GridEntityType | undefined,
  ): SpawnGridEntityResponse {
    const spawnGridEntityResponse = new SpawnGridEntityResponse();
    spawnGridEntityResponse.setGridEntity(gridEntity);
    return spawnGridEntityResponse;
  }

  transformEntities(): EntityOrGridEntity[] {
    const removeEntityResponse = this.getRemoveResponse();
    const spawnEntityResponse = this.getSpawnResponse();
    if (
      removeEntityResponse === undefined ||
      spawnEntityResponse === undefined
    ) {
      return [];
    }

    // Remove the entities.
    const removedEntities =
      removeEntityResponse.trigger() as EntityOrGridEntity[];

    // For each removed entity, spawn the transformed entity with the same position and velocity
    // (using TriggerData).
    let transformedEntities: EntityOrGridEntity[] = [];
    for (const removedEntity of removedEntities) {
      // Get old entity's position and velocity (if grid entity, will take middle pos for position,
      // and zero for velocity).
      const [position, velocity] = isGridEntity(removedEntity)
        ? [removedEntity.Position, VectorZero]
        : [removedEntity.Position, removedEntity.Velocity];

      // Update TriggerData
      const newTriggerData = {} as TriggerData;
      newTriggerData.spawnPosition = position;
      newTriggerData.spawnVelocity = velocity;
      newTriggerData.shouldSpawnGridEntityResponseDelay = true;

      // Spawn the transformed entity.
      const transformedEntity = spawnEntityResponse.trigger(
        newTriggerData,
      ) as EntityOrGridEntity[];

      transformedEntities = [...transformedEntities, ...transformedEntity];
    }

    return transformedEntities;
  }

  override setAmountOfActivations(_amount: number | Range): this {
    error(
      "TransformResponse does not use amountOfActivations. Use the removal responses' 'amount of activations' to dictate how many entities you want to transform.",
    );
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getNoun(_eid: boolean): string {
    error("TransformResponse.getNoun() should not be called");
  }

  /** E.g "all rocks" */
  getRemoveText(_eid: boolean): string {
    const removeResponse = this.getRemoveResponse();
    if (removeResponse === undefined) {
      return EMPTY_RESPONSE_TEXT;
    }

    return removeResponse.getNoun(_eid);
  }

  /** E.g "spikes" */
  getSpawnText(_eid: boolean): string {
    const spawnResponse = this.getSpawnResponse();
    if (spawnResponse === undefined) {
      return EMPTY_RESPONSE_TEXT;
    }

    return spawnResponse.getNoun(_eid);
  }

  override getText(eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const removeText = this.getRemoveText(eid);
    const spawnText = this.getSpawnText(eid);

    return `${verb} ${removeText} into ${spawnText}`;
  }

  override shouldFlattenResults(): boolean {
    return true;
  }

  /**
   * Use the removal responses' 'amount of activations' to dictate how many entities you want to
   * transform.
   */
  override shouldSkipAmountOfActivations(): boolean {
    return true;
  }

  override trigger(triggerData?: TriggerData): EntityOrGridEntity[] {
    return super.trigger(triggerData) as EntityOrGridEntity[];
  }

  override fire(_triggerData: TriggerData): EntityOrGridEntity[] {
    return this.transformEntities();
  }
}
