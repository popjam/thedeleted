import { CollectibleType } from "isaac-typescript-definitions";
import { mod } from "../mod";

/** Check if the players' inventory is empty (i.e they have no items). */
export function isPlayerInventoryEmpty(player: EntityPlayer): boolean {
  return mod.getPlayerInventory(player).length === 0;
}

/** Get the most recent addition to the player inventory (i.e the last item they obtained). */
export function getLatestItemInPlayerInventory(
  player: EntityPlayer,
): CollectibleType | undefined {
  const inventory = mod.getPlayerInventory(player);

  const latestItemInInventory = inventory[inventory.length - 1];
  if (latestItemInInventory === undefined) {
    return;
  }

  return latestItemInInventory;
}