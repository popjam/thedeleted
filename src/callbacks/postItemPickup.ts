import { ItemType } from "isaac-typescript-definitions";
import {
  getPlayerIndex,
  ModCallbackCustom,
  ModUpgraded,
  PickingUpItem,
  PickingUpItemCollectible,
  PickingUpItemTrinket,
} from "isaacscript-common";
import { corruptItemsPreItemPickupCollectible } from "../features/corruption/inversion/pickupInversion";
import { fprint } from "../helper/printHelper";

export function postItemPickupInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  if (pickingUpItem.itemType === ItemType.TRINKET) {
    mainTrinketPickup(player, pickingUpItem);
  } else if (pickingUpItem.itemType !== ItemType.NULL) {
    mainCollectiblePickup(player, pickingUpItem);
  }
}

function mainCollectiblePickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemCollectible,
) {
  corruptItemsPreItemPickupCollectible(player, pickingUpItem);
}

function mainTrinketPickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItemTrinket,
) {
  fprint(
    `postItemPickup: ${getPlayerIndex(
      player,
    )} is picking up trinket of subType: ${pickingUpItem.subType}`,
  );
}
