import {
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { CollectibleTypeCustom } from "../enums/general/CollectibleTypeCustom";
import { bitflipPostUseItem } from "../items/bitflip";
import { d14PostUseItem } from "../items/d14";

export function postUseItemInit(mod: ModUpgraded): void {
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainBitflip,
    CollectibleTypeCustom.BITFLIP,
  );
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainD14,
    CollectibleTypeCustom.D14,
  );
}

function mainBitflip(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
) {
  return bitflipPostUseItem(
    collectibleType,
    rng,
    player,
    useFlags,
    activeSlot,
    customVarData,
  );
}

function mainD14(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
) {
  return d14PostUseItem(
    collectibleType,
    rng,
    player,
    useFlags,
    activeSlot,
    customVarData,
  );
}
