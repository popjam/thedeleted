import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { getPlayerIndex } from "isaacscript-common";
import { SoundEffectCustom } from "../enums/SoundEffectCustom";
import {
  isPlayerInverted,
  setPlayerInversion,
} from "../features/corruption/inversion";
import { setAllItemsOnLevelInversion } from "../features/corruption/pickupInversion";
import { fprint } from "../helper/printHelper";

const BITFLIP_TO_CORRUPTED_SFX = SoundEffectCustom.BITFLIP_IN;
const BITFLIP_TO_NORMAL_SFX = SoundEffectCustom.BITFLIP_OUT;

export function bitflipPostUseItem(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
): boolean {
  return bitFlipUse(player);
}

/**
 * On bitflip, invert the players' inversion status. Additionally, change inversion status of all
 * pre-existing items on the floor to that of the players' new inversion status.
 */
function bitFlipUse(player: EntityPlayer): boolean {
  const isInverted = isPlayerInverted(player);
  fprint(
    `${getPlayerIndex(player)} is bitflipping to become ${
      isInverted ? "non-inverted" : "inverted"
    }`,
  );
  setPlayerInversion(player, !isInverted);
  setAllItemsOnLevelInversion(!isInverted);
  SFXManager().Play(
    !isInverted ? BITFLIP_TO_CORRUPTED_SFX : BITFLIP_TO_NORMAL_SFX,
  );
  return false;
}
