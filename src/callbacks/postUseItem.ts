import {
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { CollectibleTypeCustom } from "../enums/general/CollectibleTypeCustom";
import { bitflipPostUseItem } from "../features/items/bitflip";
import { d14PostUseItem } from "../features/items/d14";
import { extractPostUseItem } from "../features/items/extract";
import { extractFirePostUseItem } from "../features/items/extractVariants/extractFire";
import { trashPostUseItem } from "../features/items/trash";

export function postUseItemInit(mod: ModUpgraded): void {
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainBitflip,
    CollectibleTypeCustom.BITFLIP,
  );
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainBitflip,
    CollectibleTypeCustom.BITFLIP_PINK,
  );
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainD14,
    CollectibleTypeCustom.D14,
  );
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainTrash,
    CollectibleTypeCustom.TRASH,
  );
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainExtract,
    CollectibleTypeCustom.EXTRACT,
  );
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainExtractFire,
    CollectibleTypeCustom.EXTRACT_FIRE,
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

function mainTrash(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
) {
  return trashPostUseItem(
    collectibleType,
    rng,
    player,
    useFlags,
    activeSlot,
    customVarData,
  );
}

function mainExtract(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
) {
  return extractPostUseItem(
    collectibleType,
    rng,
    player,
    useFlags,
    activeSlot,
    customVarData,
  );
}

function mainExtractFire(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
) {
  return extractFirePostUseItem(
    collectibleType,
    rng,
    player,
    useFlags,
    activeSlot,
    customVarData,
  );
}
