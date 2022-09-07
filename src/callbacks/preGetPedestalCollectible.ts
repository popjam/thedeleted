import {
  CollectibleType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import { corruptItemsPreGetPedestalCollectible } from "../features/corruption/pickupInversion";

const NULL_COLLECTIBLE_SUBTYPE = CollectibleType.NULL as number;
const PLAYER_CAN_PICKUP_ITEM_ITEM_HOLD_COOLDOWN_VALUE = 0;
const ITEM_CAN_BE_PICKED_UP_WAIT_VALUE = 0;

export function preGetPedestalCollectibleInit(mod: Mod): void {
  mod.AddCallback(
    ModCallback.PRE_PICKUP_COLLISION,
    prePickupCollision,
    PickupVariant.COLLECTIBLE,
  ); // 35
}

function hasSubscriptions() {
  return true;
}

// ModCallback.PRE_PICKUP_COLLISION (35)
function prePickupCollision(
  pickup: EntityPickup,
  collider: Entity,
  low: boolean,
): boolean | undefined {
  pickup = pickup as EntityPickupCollectible;

  if (!hasSubscriptions()) {
    return;
  }

  if (pickup.SubType === NULL_COLLECTIBLE_SUBTYPE) {
    return;
  }

  const player = collider.ToPlayer();
  if (player === undefined) {
    return;
  }

  if (pickup.Price > player.GetNumCoins()) {
    return;
  }

  if (pickup.Wait > ITEM_CAN_BE_PICKED_UP_WAIT_VALUE) {
    return;
  }

  if (
    player.ItemHoldCooldown > PLAYER_CAN_PICKUP_ITEM_ITEM_HOLD_COOLDOWN_VALUE
  ) {
    return;
  }

  if (player.IsHoldingItem()) {
    return;
  }

  return main(player, pickup as EntityPickupCollectible);
}

function main(
  player: EntityPlayer,
  collectible: EntityPickupCollectible,
): boolean | undefined {
  return corruptItemsPreGetPedestalCollectible(player, collectible);
}
