import { game, getPlayerIndex } from "isaacscript-common";
import { SoundEffectCustom } from "../../../enums/general/SoundEffectCustom";
import {
  _setPlayerInversion,
  getInvertedPlayers,
  isPlayerInverted,
} from "../../../features/corruption/inversion/playerInversion";
import {
  _removeCorruptedBackdrop,
  _setCorruptedBackdrop,
} from "../../../features/general/backdropHelper";
import { removeAllCostumes, restoreAllCostumes } from "../../costumeHelper";
import { fprint } from "../../printHelper";
import { setAllPedestalsOnLevelInversion } from "./pedestalInversion";

const NORMAL_TO_INVERTED_SFX = SoundEffectCustom.BITFLIP_IN;
const INVERTED_TO_NORMAL_SFX = SoundEffectCustom.BITFLIP_OUT;
const SCREEN_SHAKE_TIMEOUT = 10;

/**
 * This is not exported as it should never be used outside this file - the world is only inverted
 * when at least one player is inverted.
 */
function updateNormalWorldToInverted() {
  fprint("World is flipping inversion to become inverted");
  setAllPedestalsOnLevelInversion(true);
  game.ShakeScreen(SCREEN_SHAKE_TIMEOUT);
  _setCorruptedBackdrop();
  // setFloorColor();
}

function updateInvertedWorldToNormal() {
  fprint("World is flipping inversion to become non-inverted");
  setAllPedestalsOnLevelInversion(false);
  game.ShakeScreen(SCREEN_SHAKE_TIMEOUT);
  _removeCorruptedBackdrop();
}

/** General function to change the players' inversion status, will update pedestals + backdrop. */
export function invertPlayer(player: EntityPlayer): void {
  const isInverted = isPlayerInverted(player);
  fprint(
    `${getPlayerIndex(player)} is flipping inversion to become ${
      isInverted ? "non-inverted" : "inverted"
    }`,
  );

  /** Player Inversion. */
  _setPlayerInversion(player, !isInverted);
  if (!isInverted) {
    // NON-INVERTED --> INVERTED
    SFXManager().Play(NORMAL_TO_INVERTED_SFX);
    removeAllCostumes(player);
  } else {
    // INVERTED --> NON-INVERTED
    SFXManager().Play(INVERTED_TO_NORMAL_SFX);
    restoreAllCostumes(player);
  }

  /** World Inversion, does not happen every player inversion. */
  const invertedPlayers = getInvertedPlayers();
  if (invertedPlayers.length === 0) {
    /** World has turned from inverted -> non-inverted. */
    updateInvertedWorldToNormal();
  } else if (invertedPlayers.length === 1 && !isInverted) {
    /** World has turned from non-inverted -> inverted. */
    updateNormalWorldToInverted();
  }
}
