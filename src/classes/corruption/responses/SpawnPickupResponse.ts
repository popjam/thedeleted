import { EntityType, PickupVariant } from "isaac-typescript-definitions";
import { VectorZero } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import type { PickupID } from "../../../enums/data/ID/PickupID";
import type { PickupType } from "../../../enums/general/PickupType";
import {
  getPickupIDName,
  getRandomPickupID,
  getRandomPickupIDFromPickupType,
  getSoftRandomPickupIDFromPickupType,
  spawnPickupID,
} from "../../../helper/entityHelper/pickupIDHelper";
import { getIncludeModdedPickupsInGenerationSetting } from "../../../features/settings/ModdedPickupSettings";
import { RANDOM_PICKUP_ID } from "../../../constants/pickupConstants";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import { pickupTypeToString } from "../../../maps/data/name/pickupTypeNameMap";
import { getRandomPosition } from "../../../helper/positionHelper";
import type { SpawnEntityResponseInterface } from "../../../interfaces/corruption/responses/SpawnEntityResponseInterface";

const DEFAULT_PICKUP_ID =
  `${EntityType.PICKUP}.${PickupVariant.POOP}.0` as PickupID;
const DEFAULT_SOFT_RANDOM = false;
const VERB = "spawn";
const VERB_PARTICIPLE = "spawning";
const UNKNOWN_PICKUP_TEXT = "mysterious pickup";

/**
 * Response to spawn a Pickup. The pickup will be spawned at a random accessible position with a
 * velocity of zero, unless overridden.
 *
 * @field p The PickupID or PickupType to spawn. If not specified, a random Pickup will be spawned.
 * @field sp Override the position to spawn the Pickup at.
 * @field v Override the velocity of the Pickup.
 * @field sft If true, if the pickup is a random pickup, it will have less chance of being a good
 *        pickup, instead of an equal chance at being a pickup of that type. Defaults to false.
 */
export class SpawnPickupResponse
  extends Response
  implements SpawnEntityResponseInterface<SpawnPickupResponse>
{
  override responseType: ResponseType = ResponseType.SPAWN_PICKUP;
  p?: PickupID | PickupType;
  sp?: Vector;
  v?: Vector;
  sft?: boolean;

  construct(
    pickupID?: PickupID | PickupType,
    softRandom?: boolean,
    overridePos?: Vector,
    overrideVel?: Vector,
  ): this {
    if (pickupID !== undefined) {
      this.setPickup(pickupID);
    }
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (overrideVel !== undefined) {
      this.setVelocity(overrideVel);
    }
    if (softRandom !== undefined) {
      this.setSoftRandom(softRandom);
    }
    return this;
  }

  getPickup(): PickupID | PickupType | undefined {
    return this.p;
  }

  setPickup(pickupID: PickupID | PickupType): this {
    this.p = pickupID;
    return this;
  }

  getPosition(): Vector | undefined {
    return this.sp;
  }

  setPosition(position?: Vector): this {
    this.sp = position;
    return this;
  }

  /**
   * If true, if the pickup is a random pickup, it will have less chance of being a good pickup,
   * instead of an equal chance at being a pickup of that type. Defaults to false.
   */
  getSoftRandom(): boolean {
    return this.sft ?? DEFAULT_SOFT_RANDOM;
  }

  /**
   * If true, if the pickup is a random pickup, it will have less chance of being a good pickup,
   * instead of an equal chance at being a pickup of that type. Defaults to false.
   */
  setSoftRandom(softRandom: boolean): this {
    this.sft = softRandom;
    return this;
  }

  getVelocity(): Vector | undefined {
    return this.v;
  }

  setVelocity(velocity?: Vector): this {
    this.v = velocity;
    return this;
  }

  spawnPickup(
    pickup: PickupID,
    position: Vector,
    velocity: Vector,
  ): EntityPickup {
    return spawnPickupID(pickup, position, velocity);
  }

  calculatePickup(): PickupID {
    const softRandom = this.getSoftRandom();
    const pickup = this.getPickup();
    const moddedPickupSetting = getIncludeModdedPickupsInGenerationSetting();

    // If the Pickup is undefined, spawn a random pickup.
    if (pickup === undefined) {
      if (softRandom) {
        return RANDOM_PICKUP_ID;
      }
      return (
        getRandomPickupID(moddedPickupSetting ? undefined : false) ??
        DEFAULT_PICKUP_ID
      );
    }

    if (typeof pickup === "string") {
      return pickup;
    }

    // If the Pickup is a PickupType, and it is soft random.
    if (softRandom) {
      return getSoftRandomPickupIDFromPickupType(pickup);
    }

    return getRandomPickupIDFromPickupType(pickup) ?? DEFAULT_PICKUP_ID;
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

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "a random pickup"
   * @example "a random bomb"
   * @example "3 sticky nickels"
   */
  override getNoun(): string {
    const isMultiple = this.isMultiple();
    const pickup = this.getPickup();

    if (pickup === undefined) {
      if (isMultiple) {
        const amountOfActivationsText = this.getAmountOfActivationsText();
        return `${amountOfActivationsText} random pickups`;
      }

      return "a random pickup";
    }

    // Is a PickupID.
    if (typeof pickup === "string") {
      const pickupName = getPickupIDName(pickup) ?? UNKNOWN_PICKUP_TEXT;

      if (isMultiple) {
        const amountOfActivationsText = this.getAmountOfActivationsText();
        return `${amountOfActivationsText} ${addTheS(pickup, isMultiple)}`;
      }

      return `${addArticle(pickupName)}`;
    }

    // It's a PickupType.
    const pickupTypeText = pickupTypeToString(pickup).toLowerCase();
    if (isMultiple) {
      const amountOfActivationsText = this.getAmountOfActivationsText();
      return `${amountOfActivationsText} random ${addTheS(
        pickupTypeText,
        isMultiple,
      )}`;
    }

    return `a random ${pickupTypeText}`;
  }

  getText(_eid: boolean, participle: boolean): string {
    const noun = this.getNoun();
    const verb = this.getVerb(participle);

    return `${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): EntityPickup[] {
    return super.trigger(triggerData) as EntityPickup[];
  }

  fire(triggerData: TriggerData): EntityPickup {
    // Determine the player.
    const pickup = this.calculatePickup();
    const position = this.calculatePosition(triggerData);
    const velocity = this.calculateVelocity(triggerData);

    return this.spawnPickup(pickup, position, velocity);
  }
}
