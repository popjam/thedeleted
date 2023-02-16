import { ActiveSlot, PlayerType } from "isaac-typescript-definitions";
import {
  getPlayerIndex,
  playerAddCollectible,
  setActiveItem,
  setPlayerHealth,
} from "isaacscript-common";
import { Mode } from "../../enums/modes/Mode";
import {
  isModeTainted,
  isPlayerDeleted,
} from "../../helper/deletedSpecific/deletedHelper";
import {
  setPlayerBombs,
  setPlayerCoins,
  setPlayerKeys,
} from "../../helper/playerHelper";
import { fprint } from "../../helper/printHelper";
import { getModeFin, getModeInit } from "../../maps/modes/modeInitMap";
import {
  getModeData,
  getModeFromPlayerType,
  getModePlayerType,
} from "../../maps/modes/modeMap";
import { mod } from "../../mod";
import { setPlayerInvertedItemActionSetBuilderReference } from "../corruption/corruptionGeneration";

/** Responsible for keeping track of Deleted's modes. */

const v = {
  persistent: {
    /** The mode N.Deleted will be upon starting a run. */
    normalMode: Mode.HAPPY99,
    /** The mode T.Deleted will be upon starting a run. */
    taintedMode: Mode.SOPHOS,
  }, // NOTE: There are currently no checks in place to
};

export function modeInit(): void {
  mod.saveDataManager("mode", v);
}

/**
 * Get the real mode of the deleted player. Returns undefined if player is not a PlayerType which
 * corresponds to a mode (e.g not a Deleted).
 */
export function getCurrentPlayerMode(player: EntityPlayer): Mode | undefined {
  return getModeFromPlayerType(player.GetPlayerType());
}

/**
 * Set the current mode of the Deleted player. Set up any mode specific settings. If the player is
 * not Deleted, does nothing.
 */
export function setPlayerMode(player: EntityPlayer, mode: Mode): void {
  if (!isPlayerDeleted(player)) {
    return;
  }
  if (getModePlayerType(mode) !== player.GetPlayerType()) {
    player.ChangePlayerType(getModePlayerType(mode));
    return;
  }
  // TODO:
  setPersistentMode(mode);
  // Setup player.
  const modeData = getModeData(mode);
  // Consumables:
  setPlayerBombs(player, modeData.startingBombs);
  setPlayerKeys(player, modeData.startingKeys);
  setPlayerCoins(player, modeData.startingCoins);
  // Health:
  setPlayerHealth(player, modeData.startingHealth);
  // Items:
  if (modeData.startingPocket !== undefined) {
    setActiveItem(player, modeData.startingPocket, ActiveSlot.POCKET);
  }
  if (modeData.startingItems !== undefined) {
    playerAddCollectible(player, ...modeData.startingItems);
  }
  if (modeData.itemActionSetBuilderReference !== undefined) {
    setPlayerInvertedItemActionSetBuilderReference(
      player,
      modeData.itemActionSetBuilderReference,
    );
  }
  // Init mode:
  getModeInit(mode)(player);
}

/** Get the persistent normal-Deleted mode. */
export function getPersistentNormalMode(): Mode {
  return v.persistent.normalMode;
}

/**
 * Set the persistent Deleted mode. This will determine whether the mode is for Deleted or Tainted
 * Deleted and modify the appropriate value, so next time a run is started the most recent mode is
 * loaded (for the appropriate CharacterType).
 */
export function setPersistentMode(mode: Mode): void {
  if (isModeTainted(mode)) {
    v.persistent.taintedMode = mode;
  } else {
    v.persistent.normalMode = mode;
  }
}

/** Get the persistent tainted-Deleted mode. */
export function getPersistentTaintedMode(): Mode {
  return v.persistent.taintedMode;
}

/** When the player first loads in as a Mode, set it up. */
export function modePostPlayerInitFirst(player: EntityPlayer): void {
  const mode = getModeFromPlayerType(player.GetPlayerType());
  if (mode !== undefined) {
    fprint(`Starting up mode: ${mode} for player ${getPlayerIndex(player)}`);
    setPlayerMode(player, mode);
  }
}

/**
 * If changing to a deleted PlayerType, sets them up appropriately. Also handles calling a mode's
 * finalization function upon switching from that mode.
 */
export function postPlayerChangeTypeMode(
  player: EntityPlayer,
  oldCharacter: PlayerType,
  newCharacter: PlayerType,
): void {
  const oldMode = getModeFromPlayerType(oldCharacter);
  if (oldMode !== undefined) {
    fprint(
      `Finishing up mode: ${oldMode} for player ${getPlayerIndex(player)}`,
    );
    getModeFin(oldMode)(player);
  }
  const newMode = getModeFromPlayerType(newCharacter);
  if (newMode !== undefined) {
    fprint(`Starting up mode: ${newMode} for player ${getPlayerIndex(player)}`);
    setPlayerMode(player, newMode);
  }
}

/** Sets the Deleted Mode's tear color. */
// CACHE_UPDATE, CacheFlag.TEAR_COLOR
export function modeEvaluateCacheTearColor(player: EntityPlayer): void {
  const mode = getCurrentPlayerMode(player);
  if (mode !== undefined) {
    const { mainColor } = getModeData(mode);
    if (mainColor !== undefined) {
      player.TearColor = mainColor;
    }
  }
}
