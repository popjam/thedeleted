import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { sfxManager } from "isaacscript-common";
import { SoundEffectCustom } from "../../enums/general/SoundEffectCustom";
import { mod } from "../../mod";

const SUCCESSFUL_TRASH_SFX = SoundEffectCustom.TRASH;

export function trashPostUseItem(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  return trashUse(player);
}

function trashUse(
  player: EntityPlayer,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  const inventory = mod.getPlayerInventory(player);
  if (inventory.length === 0) {
    return;
  }

  const latestItemInInventory = inventory[inventory.length - 1];
  if (latestItemInInventory === undefined) {
    return;
  }
  player.RemoveCollectible(latestItemInInventory);
  sfxManager.Play(SUCCESSFUL_TRASH_SFX);
  return undefined;
}
