import { CollectibleType, PickupVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  setCollectibleSubType,
} from "isaacscript-common";
import { fprint } from "../../helper/printHelper";
import { CustomModFeature } from "../CustomModFeature";

export interface EveryItemIsInstance {
  collectibleType: CollectibleType;
}

export interface EveryItemIsInput {
  collectibleType: CollectibleType;
}

/**
 * Once this feature is enabled, every item spawned will be of one CollectibleType.
 *
 * If there are multiple subscribers, it will favor the most recent addition.
 * TODO: Prevent infinite loops.
 */
export class EveryItemIsFeature extends CustomModFeature<EveryItemIsInstance> {
  override v = {
    run: {
      subscribers: new Map<number, EveryItemIsInstance>([]),
      ids: 0,
    },
  };

  /**
   * Once this feature is enabled, every item spawned will be of one CollectibleType.
   *
   * If there are multiple subscribers, it will favor the most recent addition.
   */
  override subscribe(collectibleType: CollectibleType): number {
    return this.subscribeWithInput({ collectibleType });
  }

  override subscribeWithInput(input: EveryItemIsInput): number {
    fprint("Subscribing to EveryItemIsFeature!");

    return this.addInstance({ ...input });
  }

  override unsubscribe(id: number): void {
    fprint("Unsubscribing from EveryItemIsFeature!");

    this.removeInstance(id);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FIRST,
    PickupVariant.COLLECTIBLE,
  )
  postPickupInitFirst(pickup: EntityPickup): void {
    const allCollectibleTypes = [...this.v.run.subscribers.values()].map(
      (value: EveryItemIsInstance) => value.collectibleType,
    );
    const latestCollectibleType =
      allCollectibleTypes[allCollectibleTypes.length - 1];
    if (latestCollectibleType === undefined) {
      return;
    }
    if ((pickup.SubType as CollectibleType) === latestCollectibleType) {
      return;
    }
    setCollectibleSubType(pickup, latestCollectibleType);
  }
}
