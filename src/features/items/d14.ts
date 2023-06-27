import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { getCollectibles } from "isaacscript-common";
import { SoundEffectCustom } from "../../enums/general/SoundEffectCustom";
import {
  setAllPedestalsOnLevelInversion,
  setPedestalInversion,
} from "../../helper/deletedSpecific/inversion/pedestalInversion";
import { fprint } from "../../helper/printHelper";
import { generateInvertedItemActionSetFromPlayer } from "../corruption/corruptionGeneration";

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
  /**
   * We need to set all pedestals in the room to not be inverted, as the D6 use on inverted
   * pedestals will trigger default InvertedActionSet generation before the D14 triggers its own
   * InvertedActionSet generation.
   */
  setAllPedestalsOnLevelInversion(false);
  fprint("D-14 used.");
  player.UseActiveItem(CollectibleType.D6, UseFlag.NO_ANIMATION);
  getCollectibles().forEach((collectible) => {
    setPedestalInversion(
      true,
      collectible,
      generateInvertedItemActionSetFromPlayer(player),
    );
  });
  SFXManager().Play(D14_SFX);
  return { Discharge: true, Remove: false, ShowAnim: true };
}
