import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { Response } from "./Response";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { GridID } from "../../../enums/data/ID/GridID";
import {
  getRandomGridID,
  spawnGridID,
} from "../../../helper/gridEntityHelper/gridIDHelper";
import { gridIDToString } from "../../../maps/data/name/gridIDNameMap";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import {
  getRandomArrayElement,
  isVector,
  vectorToString,
} from "isaacscript-common";
import {
  getAllEmptyGridIndexes,
  positionToClampedGridIndex,
} from "../../../helper/gridEntityHelper/gridEntityHelper";
import { fprint } from "../../../helper/printHelper";
import { mod } from "../../../mod";
import type { GridEntityType } from "isaac-typescript-definitions";
import { gridEntityTypeToString } from "../../../maps/data/name/gridEntityTypeNameMap";

const VERB = "spawn";
const VERB_PARTICIPLE = "spawning";
const GRID_ENTITY_NOUN = "obstacle";
const GRID_ENTITY_NOUN_PLURAL = "obstacles";

/**
 * Response to spawn a Grid Entity.
 *
 * @param ge The Grid Entity to spawn. If undefined, will spawn a random non-modded Grid Entity.
 * @param gi The overridden grid index the grid entity will spawn at. If it's a Vector, it will
 *           convert it to the nearest grid index.
 */
export class SpawnGridEntityResponse extends Response {
  override responseType: ResponseType = ResponseType.SPAWN_GRID;
  ge?: GridID | GridEntityType;
  gi?: number;

  /**
   * Response to spawn a Grid Entity.
   *
   * @param gridID The Grid Entity to spawn. If undefined, will spawn a random non-modded Grid
   *               Entity. If it's a GridEntityType, will spawn a random Grid Entity of that type.
   * @param positionOrGrid The overridden grid index the grid entity will spawn at. If it's a
   *                       Vector, it will convert it to the nearest grid index.
   */
  construct(
    gridID?: GridID | GridEntityType,
    positionOrGrid?: Vector | number,
  ): this {
    if (gridID !== undefined) {
      this.setGridEntity(gridID);
    }
    this.setPosition(positionOrGrid);
    return this;
  }

  /**
   * Set the overridden grid index the grid entity will spawn at. If it's a Vector, it will convert
   * it to the nearest grid index.
   *
   * @param positionOrGrid The overridden grid index the grid entity will spawn at. If it's a
   *                       Vector, it will convert it to the nearest grid index. If undefined, will
   *                       spawn at a random grid index.
   */
  setPosition(positionOrGrid: Vector | number | undefined): this {
    if (isVector(positionOrGrid)) {
      this.gi = positionToClampedGridIndex(positionOrGrid);
      return this;
    }
    this.gi = positionOrGrid;
    return this;
  }

  /** Get the overridden grid index the grid entity will spawn at. */
  getPosition(): number | undefined {
    return this.gi;
  }

  /**
   * Get the overridden grid index the grid entity will spawn at. If it's undefined, will spawn at a
   * random grid index.
   */
  calculatePosition(triggerData: TriggerData): number | undefined {
    const position = this.getPosition();
    if (position !== undefined) {
      return position;
    }

    const { spawnPosition } = triggerData;
    if (spawnPosition !== undefined) {
      const gridIndex = positionToClampedGridIndex(spawnPosition);
      fprint(
        `SpawnGridEntityResponse: Using index ${gridIndex} and spawn position: ${vectorToString(
          spawnPosition,
        )}.`,
      );
      return gridIndex;
    }

    const safeGridIndices = getAllEmptyGridIndexes();
    if (safeGridIndices.length === 0) {
      return undefined;
    }

    return getRandomArrayElement(safeGridIndices, undefined);
  }

  /**
   * Set the Grid Entity to spawn. If it is undefined, will spawn a random non-modded Grid Entity.
   */
  setGridEntity(gridID: GridID | GridEntityType | undefined): void {
    this.ge = gridID;
  }

  /**
   * Set the Grid Entity to spawn. If it is undefined, will spawn a random non-modded Grid Entity.
   */
  getGridEntity(): GridID | GridEntityType | undefined {
    return this.ge;
  }

  calculateGridEntity(): GridID {
    const gridEntity = this.getGridEntity();
    if (gridEntity === undefined) {
      return getRandomGridID();
    }

    if (typeof gridEntity === "number") {
      return `${gridEntity}.-1` as GridID;
    }

    return gridEntity;
  }

  spawnGridEntities(triggerData: TriggerData): GridEntity[] {
    const amountOfActivations = this.calculateAmountOfActivations();

    // Spawn the grid entities.
    const gridEntities: GridEntity[] = [];
    for (let i = 0; i < amountOfActivations; i++) {
      const gridEntityID = this.calculateGridEntity();
      const position = this.calculatePosition(triggerData);
      if (position === undefined) {
        break;
      }

      // We don't want to spawn the grid entity on top of another grid entity, as this calls 'room
      // update' and will invoke the room update USE_CALLBACK bug. If the grid entity does somehow
      // decide to spawn on top of another grid entity, nothing will happen.
      const spawnedGridEntity = spawnGridID(gridEntityID, position, false);
      if (spawnedGridEntity !== undefined) {
        gridEntities.push(spawnedGridEntity);
      }
    }

    // Update the room?

    return gridEntities;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "a rock"
   * @example "3-4 random obstacles"
   */
  override getNoun(): string {
    const gridEntity = this.getGridEntity();
    const isMultiple = this.isMultiple();

    // GridEntityType
    if (typeof gridEntity === "number") {
      if (!isMultiple) {
        return addArticle(gridEntityTypeToString(gridEntity).toLowerCase());
      }

      return `${this.getAmountOfActivationsText()} ${addTheS(
        gridEntityTypeToString(gridEntity).toLowerCase(),
        true,
      )}`;
    }

    if (gridEntity !== undefined) {
      if (!isMultiple) {
        return addArticle(gridIDToString(gridEntity));
      }

      return `${this.getAmountOfActivationsText()} ${addTheS(
        gridIDToString(gridEntity),
        true,
      )}`;
    }

    // Random Grid Entity.
    if (isMultiple) {
      return `${this.getAmountOfActivationsText()} random ${GRID_ENTITY_NOUN_PLURAL}`;
    }

    return `a random ${GRID_ENTITY_NOUN}`;
  }

  override shouldFlattenResults(): boolean {
    return true;
  }

  override shouldSkipAmountOfActivations(): boolean {
    return true;
  }

  override getText(_eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun();
    const chanceToActivate = this.getChanceToActivateText(participle);

    return `${chanceToActivate} ${verb} ${noun}`;
  }

  // Delay for TransformResponse.
  override trigger(triggerData?: TriggerData): GridEntity[] {
    if (triggerData?.shouldSpawnGridEntityResponseDelay ?? false) {
      fprint("Delaying SpawnGridEntityResponse.");
      mod.runInNGameFrames(() => super.trigger(triggerData), 1, true);
      return [];
    }
    return super.trigger(triggerData) as GridEntity[];
  }

  override fire(triggerData: TriggerData): GridEntity[] {
    // TODO: Use REPENTOGON's safe grid position code.
    return this.spawnGridEntities(triggerData);
  }
}
