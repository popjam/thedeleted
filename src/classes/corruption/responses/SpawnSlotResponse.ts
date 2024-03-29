import type { EntityID } from "isaacscript-common";
import { getRandomSetElement, spawnEntityID } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import { getEntityIDSetFromCategory } from "../../../features/data/gameSets/gameSets";
import { EntityCategory } from "../../../enums/general/EntityCategory";
import type { SlotVariant } from "isaac-typescript-definitions";
import { EntityType } from "isaac-typescript-definitions";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import { getRandomPosition } from "../../../helper/positionHelper";
import {
  getEntityCategoryFromEntityID,
  getEntityNameFromEntityID,
} from "../../../helper/entityHelper/entityIDHelper";
import type { SpawnEntityResponseInterface } from "../../../interfaces/corruption/responses/SpawnEntityResponseInterface";

const VERB = "spawn";
const VERB_PARTICIPLE = "spawning";
const DEFAULT_SPAWN_VELOCITY = Vector(0, 0);
const DEFAULT_SUBTYPE = 0;
const MACHINE_NOUN = "machine";
const MACHINE_NOUN_PLURAL = "machines";
const UNKNOWN_SLOT_NAME_TEXT = `mysterious ${MACHINE_NOUN}`;

/**
 * Response to spawn a Slot.
 *
 * @param e The EntityID referring to the Slot you want to spawn. If undefined, will spawn a random
 *          Slot.
 * @param sp The position to spawn the Slot/s at. If not specified, will spawn at a random safe
 *           position.
 * @param v The velocity to spawn the Slot/s with. If not specified, will spawn with no velocity.
 */
export class SpawnSlotResponse
  extends Response
  implements SpawnEntityResponseInterface<SpawnSlotResponse>
{
  override responseType: ResponseType = ResponseType.SPAWN_SLOT;
  e?: EntityID;
  sp?: Vector;
  v?: Vector;

  construct(
    slotVariantOrEntityID?: SlotVariant | EntityID,
    subType?: number,
    overridePos?: Vector,
    overrideVel?: Vector,
  ): this {
    if (slotVariantOrEntityID !== undefined) {
      this.setSlot(slotVariantOrEntityID, subType);
    }
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (overrideVel !== undefined) {
      this.setVelocity(overrideVel);
    }
    return this;
  }

  getSlot(): EntityID | undefined {
    return this.e;
  }

  /**
   * If an EntityID is specified, subType will be ignored. If a SlotVariant is specified, and
   * subType is undefined, subType will default to 0.
   */
  setSlot(slot: SlotVariant | EntityID, subType?: number): this {
    if (typeof slot === "string") {
      if (getEntityCategoryFromEntityID(slot) !== EntityCategory.SLOT) {
        error(`EntityID '${slot}' is not a slot!`);
      }
      this.e = slot;
      return this;
    }

    // SlotVariant.
    const entityID = `${EntityType.SLOT}.${slot}.${
      subType ?? DEFAULT_SUBTYPE
    }` as EntityID;
    this.e = entityID;
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
    return this.getVelocity() ?? DEFAULT_SPAWN_VELOCITY;
  }

  calculateSlot(): EntityID {
    const slot = this.getSlot();
    if (slot !== undefined) {
      return slot;
    }

    // Random Slot.
    const slots = getEntityIDSetFromCategory(EntityCategory.SLOT);
    return getRandomSetElement<EntityID>(slots, undefined);
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "a random slot"
   * @example "3 shell games"
   */
  override getNoun(): string {
    const slot = this.getSlot();
    const isMultiple = this.isMultiple();
    if (slot === undefined) {
      // Random slot.
      if (isMultiple) {
        return `${this.getAmountOfActivationsText()} random ${MACHINE_NOUN_PLURAL}`;
      }

      return `a random ${MACHINE_NOUN}`;
    }

    // Specific slot.
    const name =
      getEntityNameFromEntityID(slot)?.toLowerCase() ?? UNKNOWN_SLOT_NAME_TEXT;
    if (isMultiple) {
      return `${this.getAmountOfActivationsText()} ${addTheS(
        name,
        isMultiple,
      )}`;
    }

    return addArticle(name);
  }

  getText(_eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun();

    return `${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): EntitySlot[] {
    return super.trigger(triggerData) as EntitySlot[];
  }

  fire(triggerData: TriggerData): EntitySlot {
    const position = this.calculatePosition(triggerData);
    const velocity = this.calculateVelocity(triggerData);
    const slot = this.calculateSlot();

    return spawnEntityID(slot, position, velocity) as EntitySlot;
  }
}
