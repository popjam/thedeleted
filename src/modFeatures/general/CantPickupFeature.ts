import {
  EntityType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  EntityID,
  getConstituentsFromEntityID,
  getEntityIDFromConstituents,
  getPlayerIndex,
  PlayerIndex,
} from "isaacscript-common";
import { fprint } from "../../helper/printHelper";
import { CustomModFeature } from "../CustomModFeature";

export interface CantPickupInstance {
  player: PlayerIndex;
  pickup: EntityID;
}

export interface CantPickupInput {
  player: PlayerIndex;
  pickup: EntityID;
}

/**
 * This feature prevents a player from picking up a certain pickup type.
 *
 * If no pickupSubType is specified, it will default to all SubTypes.
 */
export class CantPickupFeature extends CustomModFeature<CantPickupInstance> {
  override v = {
    run: {
      subscribers: new Map<number, CantPickupInstance>([]),
      ids: 0,
    },
  };

  /**
   * This feature prevents a player from picking up a certain pickup type.
   *
   * If no pickupSubType is specified, it will default to all SubTypes.
   */
  override subscribe(
    player: EntityPlayer,
    pickupVariant: PickupVariant,
    pickupSubType = 0,
  ): number {
    return this.subscribeWithInput({
      player: getPlayerIndex(player),
      pickup: getEntityIDFromConstituents(
        EntityType.PICKUP,
        pickupVariant,
        pickupSubType,
      ),
    });
  }

  override subscribeWithInput(input: CantPickupInput): number {
    fprint("Subscribing to CantPickupFeature!");

    const instance = {
      player: input.player,
      pickup: input.pickup,
    };

    return this.addInstance(instance);
  }

  override unsubscribe(id: number): void {
    fprint("Unsubscribing from CantPickupFeature!");

    this.removeInstance(id);
  }

  @Callback(ModCallback.PRE_PICKUP_COLLISION)
  prePickupCollision(
    pickup: EntityPickup,
    collider: Entity,
    low: boolean,
  ): boolean | undefined {
    let toReturn: boolean | undefined;
    this.v.run.subscribers.forEach((instance: CantPickupInstance) => {
      const player = collider.ToPlayer();
      if (player === undefined) {
        return;
      }

      if (getPlayerIndex(player) !== instance.player) {
        return;
      }

      const constituents = getConstituentsFromEntityID(instance.pickup);
      if (constituents[2] !== 0) {
        // Specific SubType
        if (pickup.SubType !== constituents[2]) {
          return;
        }
      }
      if (pickup.Variant !== (constituents[1] as PickupVariant)) {
        return;
      }
      toReturn = false;
    });
    return toReturn;
  }
}
