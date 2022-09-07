import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { SoundEffectCustom } from "../enums/SoundEffectCustom";
import { setAllItemsInRoomInversion } from "../features/corruption/pickupInversion";

const D14_SFX = SoundEffectCustom.ROLL_DICE;

export function d14PostUseItem(
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
  return d14Use(player);
}

/**
 * On D-14 use, reroll all items in the room and make them inverted. If they are already inverted
 * they will just be rerolled.
 */
function d14Use(
  player: EntityPlayer,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  player.UseActiveItem(CollectibleType.D6, UseFlag.NO_ANIMATION);
  setAllItemsInRoomInversion(true);
  SFXManager().Play(D14_SFX);
  return undefined;
}
