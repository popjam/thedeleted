import { PickupVariant } from "isaac-typescript-definitions";

export type PreGetPedestalCollectibleRegisterParameters = [
  callback: (
    player: EntityPlayer,
    pickup: EntityPickupCollectible,
  ) => boolean | undefined,
  pickupVariant?: PickupVariant,
];

const subscriptions: PreGetPedestalCollectibleRegisterParameters[] = [];

export function preGetPedestalCollectibleHasSubscriptions(): boolean {
  return subscriptions.length > 0;
}

export function preGetPedestalCollectibleRegister(
  ...args: PreGetPedestalCollectibleRegisterParameters
): void {
  subscriptions.push(args);
}

export function preGetPedestalCollectibleFire(
  player: EntityPlayer,
  pickup: EntityPickupCollectible,
): boolean | undefined {
  for (const [callback, pickupVariant] of subscriptions) {
    // Handle the optional 2nd callback argument.
    if (pickupVariant !== undefined && pickupVariant !== pickup.Variant) {
      continue;
    }

    return callback(player, pickup);
  }
  return undefined;
}
