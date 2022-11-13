import {
  BackdropType,
  CollectibleType,
  UseFlag,
} from "isaac-typescript-definitions";
import { game, getPlayerIndex } from "isaacscript-common";
import { SoundEffectCustom } from "../../enums/general/SoundEffectCustom";
import {
  removeAllCostumes,
  restoreAllCostumes,
} from "../../helper/costumeHelper";
import { fprint } from "../../helper/printHelper";
import { setAllPedestalsOnLevelInversion } from "../corruption/inversion/pickupInversion";
import {
  isPlayerInverted,
  setPlayerInversion,
} from "../corruption/inversion/playerInversion";
import {
  overrideBackdrop,
  removeOverriddenBackdrop,
} from "../general/backdropHelper";

const NORMAL_TO_INVERTED_SFX = SoundEffectCustom.BITFLIP_IN;
const INVERTED_TO_NORMAL_SFX = SoundEffectCustom.BITFLIP_OUT;
const SCREEN_SHAKE_TIMEOUT = 10;
const INVERTED_WORLD_BACKDROP = BackdropType.ERROR_ROOM;

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
  setAllPedestalsOnLevelInversion(!isInverted);
  game.ShakeScreen(SCREEN_SHAKE_TIMEOUT);
  if (!isInverted) {
    // NON-INVERTED --> INVERTED
    SFXManager().Play(NORMAL_TO_INVERTED_SFX);
    overrideBackdrop(INVERTED_WORLD_BACKDROP);
    removeAllCostumes(player);
  } else {
    // INVERTED --> NON-INVERTED
    SFXManager().Play(INVERTED_TO_NORMAL_SFX);
    removeOverriddenBackdrop();
    restoreAllCostumes(player);
  }
  return false;
}
