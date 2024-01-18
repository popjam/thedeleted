import type { Response } from "../../../classes/corruption/responses/Response";
import type { TriggerData } from "../actions/TriggerData";

/** Defines common methods and attributes for the Responses which are used to spawn entities. */
export interface SpawnEntityResponseInterface<T extends Response> {
  /** Overridden spawn position. */
  sp?: Vector;

  /** Overridden spawn velocity. */
  v?: Vector;

  /** Get the overridden position (if any). */
  getPosition: () => Vector | undefined;

  /** Set the overridden position. */
  setPosition: (position?: Vector) => T;

  /** Get the overridden velocity (if any). */
  getVelocity: () => Vector | undefined;

  /** Set the overridden velocity. */
  setVelocity: (velocity?: Vector) => T;

  /** Determine spawn position of entity. */
  calculatePosition: (triggerData: TriggerData) => Vector;

  /** Determine spawn velocity of entity. */
  calculateVelocity: (triggerData: TriggerData) => Vector;

  /** Trigger the response, returning entities spawned. */
  trigger: (triggerData: TriggerData) => Entity[];

  /** Fire the response, returning an entity. */
  fire: (triggerData: TriggerData) => Entity;
}
