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
import { eye1PostUseItem } from "../features/items/eyes/eye1";
import { eye2PostUseItem } from "../features/items/eyes/eye2";
import { eye3PostUseItem } from "../features/items/eyes/eye3";
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
    mainBitflip,
    CollectibleTypeCustom.BITFLIP_BLUE,
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
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainEye3,
    CollectibleTypeCustom.MYDOOM_EYE_STAGE_3,
  );
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainEye2,
    CollectibleTypeCustom.MYDOOM_EYE_STAGE_2,
  );
  mod.AddCallback(
    ModCallback.POST_USE_ITEM,
    mainEye1,
    CollectibleTypeCustom.MYDOOM_EYE_STAGE_1,
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

function mainEye3(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
) {
  return eye3PostUseItem(
    collectibleType,
    rng,
    player,
    useFlags,
    activeSlot,
    customVarData,
  );
}

function mainEye2(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
) {
  return eye2PostUseItem(
    collectibleType,
    rng,
    player,
    useFlags,
    activeSlot,
    customVarData,
  );
}

function mainEye1(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
) {
  return eye1PostUseItem(
    collectibleType,
    rng,
    player,
    useFlags,
    activeSlot,
    customVarData,
  );
}
