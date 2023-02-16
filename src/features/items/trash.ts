import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { sfxManager } from "isaacscript-common";
import { SoundEffectCustom } from "../../enums/general/SoundEffectCustom";
import {
  getLatestItemInPlayerInventory,
  isPlayerInventoryEmpty,
} from "../../helper/inventoryHelper";

const SUCCESSFUL_TRASH_SFX = SoundEffectCustom.TRASH;

export function trashPostUseItem(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: int,
  _customVarData: int,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  return trashUse(player);
}

/**
 * Trashes the latest item the player has picked up. This can include active items.
 *
 * TODO?: Stop it removing pocket items, and add rewards.
 */
function trashUse(
  player: EntityPlayer,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  if (isPlayerInventoryEmpty(player)) {
    return;
  }

  const latestItemInInventory = getLatestItemInPlayerInventory(player);
  if (latestItemInInventory === undefined) {
    return;
  }
  player.RemoveCollectible(latestItemInInventory);
  sfxManager.Play(SUCCESSFUL_TRASH_SFX);
  return undefined;
}
