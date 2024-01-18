import type { GridEntityID } from "isaacscript-common";
import {
  getConstituentsFromGridEntityID,
  getRandomArrayElementAndRemove,
  removeGridEntity,
} from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { GridID } from "../../../enums/data/ID/GridID";
import {
  getGridEntitiesFromGridID,
  getRandomGridID,
} from "../../../helper/gridEntityHelper/gridIDHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import { gridIDToString } from "../../../maps/data/name/gridIDNameMap";
import { gridEntityTypeToString } from "../../../maps/data/name/gridEntityTypeNameMap";
import { addTheS } from "../../../helper/stringHelper";
import { fprint } from "../../../helper/printHelper";
import type { GridEntityType } from "isaac-typescript-definitions";

const GRID_ENTITY_NOUN = "obstacle";
const GRID_ENTITY_NOUN_PLURAL = "obstacles";
const VERB = "remove";
const VERB_PARTICIPLE = "removing";

/**
 * Response to remove a grid entity.
 *
 * @example 'Remove a random rock'.
 *
 * @param gridEntity The GridEntityID of the grid entity to remove. Can be a specific GridEntityID,
 *                   or undefined to remove any grid entity.
 * @param removeAll If true, will remove all grid entities of the specified type rather than one.
 */
export class RemoveGridEntityResponse extends Response {
  override responseType: ResponseType = ResponseType.REMOVE_GRID;
  g?: GridID | GridEntityType;
  all?: boolean;

  /**
   * Response to remove a grid entity.
   *
   * @example 'Remove a random rock'.
   *
   * @param gridEntity The GridEntityID of the grid entity to remove. Can be a specific
   *                   GridEntityID, a GridEntityType, or undefined to remove any grid entity.
   * @param removeAll If true, will remove all grid entities of the specified type rather than one.
   */
  override construct(
    gridEntity: GridID | GridEntityType | undefined,
    removeAll: boolean,
  ): this {
    this.setGridEntity(gridEntity);
    this.setRemoveAll(removeAll);
    return this;
  }

  /**
   * Get the GridEntityID of the grid entity to remove. Can be a specific GridEntityID, or undefined
   * to remove any grid entity.
   */
  getGridEntity(): GridID | GridEntityType | undefined {
    return this.g;
  }

  /**
   * Set the GridEntityID of the grid entity to remove. Can be a specific GridEntityID, a
   * GridEntityType, or undefined to remove any grid entity.
   */
  setGridEntity(gridEntity: GridID | GridEntityType | undefined): this {
    this.g = gridEntity;
    return this;
  }

  /** Whether to remove all the grid entities of the specified type. */
  getRemoveAll(): boolean {
    return this.all ?? false;
  }

  /** Whether to remove all the grid entities of the specified type. */
  setRemoveAll(removeAll: boolean): this {
    this.all = removeAll ? true : undefined;
    return this;
  }

  removeGridEntities(): GridEntity[] {
    fprint("Removing grid entities.");
    const gridEntitiesToRemove = this.getGridEntitiesToRemove();
    if (gridEntitiesToRemove.length === 0) {
      return [];
    }

    const amountOfActivations = this.getRemoveAll()
      ? gridEntitiesToRemove.length
      : this.calculateAmountOfActivations();

    fprint(`Removing ${amountOfActivations} grid entities.`);
    const returnValues: GridEntity[] = [];
    for (let i = 0; i < amountOfActivations; i++) {
      if (gridEntitiesToRemove.length === 0) {
        break;
      }

      const gridEntityToRemove = getRandomArrayElementAndRemove(
        gridEntitiesToRemove,
        undefined,
      );
      removeGridEntity(gridEntityToRemove, false);
      returnValues.push(gridEntityToRemove);
    }

    // Don't update the room, because of the USE_CALLBACK bug.

    // roomUpdateSafe();

    return returnValues;
  }

  getGridEntitiesToRemove(): GridEntity[] {
    const gridIDToRemove = this.calculateGridID();
    fprint(`Removing grid entity: ${gridIDToRemove}.`);
    return [...getGridEntitiesFromGridID(gridIDToRemove)];
  }

  calculateGridID(): GridID {
    const gridEntityToRemove = this.getGridEntity();
    if (typeof gridEntityToRemove === "string") {
      return gridEntityToRemove;
    }

    if (typeof gridEntityToRemove === "number") {
      return `${gridEntityToRemove}.-1` as GridID;
    }

    // Random Grid Entity.
    return getRandomGridID();
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "a random obstacle"
   * @example "3-4 random spikes"
   * @example "all locked doors"
   */
  override getNoun(): string {
    const gridEntityID = this.getGridEntity();
    const isMultiple = this.isMultiple();
    const removeAll = this.getRemoveAll();

    // Random grid.
    if (gridEntityID === undefined) {
      if (removeAll) {
        return `all ${GRID_ENTITY_NOUN_PLURAL}`;
      }

      if (isMultiple) {
        return `${
          this.getAmountOfActivationsText() ?? ""
        } random ${GRID_ENTITY_NOUN_PLURAL}`;
      }

      return `a random ${GRID_ENTITY_NOUN}`;
    }

    // GridEntityType
    if (typeof gridEntityID === "number") {
      const gridEntityTypeName =
        gridEntityTypeToString(gridEntityID).toLowerCase();

      if (removeAll) {
        return `all ${addTheS(gridEntityTypeName, true)}`;
      }

      if (isMultiple) {
        return `${this.getAmountOfActivationsText() ?? ""} random ${addTheS(
          gridEntityTypeName,
          true,
        )}`;
      }

      return `a random ${gridEntityTypeName}`;
    }

    // Specific grid.
    const [gridEntityType, variant] = getConstituentsFromGridEntityID(
      gridEntityID as GridEntityID,
    );
    if ((gridEntityType as number) === -1) {
      if (removeAll) {
        return `all ${GRID_ENTITY_NOUN_PLURAL}`;
      }

      if (isMultiple) {
        return `${
          this.getAmountOfActivationsText() ?? ""
        } random ${GRID_ENTITY_NOUN_PLURAL}`;
      }

      return `a random ${GRID_ENTITY_NOUN}`;
    }

    if (variant === -1) {
      if (removeAll) {
        return `all ${addTheS(gridEntityTypeToString(gridEntityType), true)}`;
      }

      if (isMultiple) {
        return `${this.getAmountOfActivationsText() ?? ""} random ${addTheS(
          gridEntityTypeToString(gridEntityType),
          true,
        )}`;
      }

      return `a random ${gridEntityTypeToString(gridEntityType)}`;
    }

    if (removeAll) {
      return `all ${addTheS(gridIDToString(gridEntityID), true)}`;
    }

    if (isMultiple) {
      return `${this.getAmountOfActivationsText() ?? ""} random ${addTheS(
        gridIDToString(gridEntityID),
        true,
      )}`;
    }

    return `a random ${gridIDToString(gridEntityID)}`;
  }

  override getText(_eid: boolean, participle: boolean): string {
    const noun = this.getNoun();
    const verb = this.getVerb(participle);

    return `${verb} ${noun}`;
  }

  override shouldFlattenResults(): boolean {
    return true;
  }

  override shouldSkipAmountOfActivations(): boolean {
    return true;
  }

  override trigger(triggerData?: TriggerData): GridEntity[] {
    return super.trigger(triggerData) as GridEntity[];
  }

  override fire(_triggerData: TriggerData): GridEntity[] {
    return this.removeGridEntities();
  }
}
