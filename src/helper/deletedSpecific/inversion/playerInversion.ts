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
import {
  _updateCorruptedFloorColor,
  _updateCorruptedFloorColorForPlayer,
} from "../../../features/general/floorColorHelper";
import { removeAllCostumes, restoreAllCostumes } from "../../costumeHelper";
import { fprint } from "../../printHelper";
import { setAllPedestalsOnLevelInversion } from "./pedestalInversion";
import {
  isWorldInverted,
  shouldInvertedWorldHaveCorruptBackdrop,
} from "./worldInversionHelper";

const NORMAL_TO_INVERTED_SFX = SoundEffectCustom.BITFLIP_IN;
const INVERTED_TO_NORMAL_SFX = SoundEffectCustom.BITFLIP_OUT;
const SCREEN_SHAKE_TIMEOUT = 10;

/**
 * This is not exported as it should never be used outside this file - the world is only inverted
 * when at least one player is inverted.
 *
 * @param silent If true, will discreetly invert the world without flipping already seen pedestals
 *               or shaking the screen. Will still set the backdrop.
 */
function updateNormalWorldToInverted(silent = false) {
  fprint("World is flipping inversion to become inverted");
  if (!silent) {
    setAllPedestalsOnLevelInversion(true);
    game.ShakeScreen(SCREEN_SHAKE_TIMEOUT);
  }
  if (shouldInvertedWorldHaveCorruptBackdrop()) {
    _setCorruptedBackdrop();
  } else {
    // Remove the backdrop if switching from a mode that has a corrupted backdrop to one that
    // doesn't.
    _removeCorruptedBackdrop();
  }
}

function updateInvertedWorldToNormal(silent = false) {
  fprint("World is flipping inversion to become non-inverted");
  if (!silent) {
    setAllPedestalsOnLevelInversion(false);
    game.ShakeScreen(SCREEN_SHAKE_TIMEOUT);
  }
  _removeCorruptedBackdrop();
}

/**
 * Inverts the player if they are not the specified inversion.
 *
 * @param player The player to invert.
 * @param inversion If true, will invert the player. If false, will un-invert the player.
 * @param silent If true, will discreetly invert the world without flipping already seen pedestals,
 *               shaking the screen, or playing the sound effect. Will still set the backdrop and
 *               floor color.
 */
export function invertPlayerToInversion(
  player: EntityPlayer,
  inversion: boolean,
  silent = false,
): void {
  const isInverted = isPlayerInverted(player);
  if (isInverted === inversion) {
    _updateCorruptedFloorColorForPlayer(player);
  } else {
    invertPlayer(player, silent);
  }
}

/**
 * General function to change the players' inversion status, will update pedestals + backdrop.
 *
 * @param player The player to invert.
 * @param silent If true, will discreetly invert the world without flipping already seen pedestals,
 *               shaking the screen, or playing the sound effect. Will still set the backdrop and
 *               floor color.
 */
export function invertPlayer(player: EntityPlayer, silent = false): void {
  const isInverted = isPlayerInverted(player);
  const worldInvertedBefore = isWorldInverted();
  fprint(
    `${getPlayerIndex(player)} is flipping inversion to become ${
      isInverted ? "non-inverted" : "inverted"
    }`,
  );

  /** Player Inversion. */
  _setPlayerInversion(player, !isInverted);
  if (isInverted) {
    // INVERTED --> NON-INVERTED
    if (!silent) {
      SFXManager().Play(INVERTED_TO_NORMAL_SFX);
    }
    restoreAllCostumes(player);
  } else {
    // NON-INVERTED --> INVERTED
    if (!silent) {
      SFXManager().Play(NORMAL_TO_INVERTED_SFX);
    }
    removeAllCostumes(player);
  }

  /** World Inversion, does not happen every player inversion. */
  if (worldInvertedBefore !== isWorldInverted()) {
    updateWorldInversion(silent);
  }

  /** Update the floor color, happens every player inversion. */
  _updateCorruptedFloorColor();
}

/**
 * Update the world inversion in accordance to how many players are inverted.
 *
 * @param silent If true, will discreetly invert the world without flipping already seen pedestals
 *               or shaking the screen. Will still set the backdrop.
 */
export function updateWorldInversion(silent = false): void {
  const invertedPlayers = getInvertedPlayers();
  if (invertedPlayers.length === 0) {
    /** World is non-inverted. */
    updateInvertedWorldToNormal(silent);
  } else {
    /** World is inverted. */
    updateNormalWorldToInverted(silent);
  }
}

/**
 * When the player dies, reset them back to their original inversion status. This is so if one
 * player dies in a 4 player game - the world isn't stuck in inversion due to the dead player being
 * unable to bitflip.
 */
export function playerInversionPostPlayerFatalDamage(
  _player: EntityPlayer,
): boolean | undefined {
  // const mode = getCurrentPlayerMode(player); invertPlayerToInversion( player, mode !== undefined
  // ? getModeData(mode).startInverted ?? false : false, true, );
  return undefined;
}
