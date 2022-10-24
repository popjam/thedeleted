import { ActiveSlot, PlayerType } from "isaac-typescript-definitions";
import {
  playerAddCollectible,
  PlayerIndex,
  setActiveItem,
  setPlayerHealth,
} from "isaacscript-common";
import { Mode } from "../../enums/modes/Mode";
import { isPlayerDeleted } from "../../helper/deletedSpecific/deletedHelper";
import {
  setPlayerBombs,
  setPlayerCoins,
  setPlayerKeys,
} from "../../helper/playerHelper";
import { getModeInit } from "../../maps/modes/modeInitMap";
import {
  getModeData,
  getModeFromPlayerType,
  getModePlayerType,
} from "../../maps/modes/modeMap";
import { mod } from "../../mod";
import { NormalMode, TaintedMode } from "../../types/modes/ModeType";

/** Responsible for keeping track of Deleted's modes. */

const v = {
  persistent: {
    /** The mode N.Deleted will be upon starting a run. */
    normalMode: Mode.HAPPY99 as NormalMode,
    /** The mode T.Deleted will be upon starting a run. */
    taintedMode: undefined,
  },
  run: {
    /** The current mode Deleted is on the run. */
    currentMode: new Map<PlayerIndex, Mode>(),
  },
};

export function modeInit(): void {
  mod.saveDataManager("mode", v);
}

/**
 * Get the real mode of the deleted player. Returns undefined if player is not a PlayerType which
 * corresponds to a mode (e.g not a Deleted).
 */
export function getCurrentMode(player: EntityPlayer): Mode | undefined {
  return getModeFromPlayerType(player.GetPlayerType());
}

/** Set the current mode of the Deleted player. Set up any mode specific settings. */
export function setPlayerMode(player: EntityPlayer, mode: Mode): void {
  if (!isPlayerDeleted(player)) {
    return;
  }
  if (getModePlayerType(mode) !== player.GetPlayerType()) {
    player.ChangePlayerType(getModePlayerType(mode));
    return;
  }
  // TODO:
  setPersistentNormalMode(mode);
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
  // Init mode:
  getModeInit(mode)(player);
}

/** Get the persistent normal-Deleted mode. */
export function getPersistentNormalMode(): NormalMode {
  return v.persistent.normalMode;
}

/** Set the persistent normal-Deleted mode. */
export function setPersistentNormalMode(mode: NormalMode): void {
  v.persistent.normalMode = mode;
}

/** Get the persistent tainted-Deleted mode. */
export function getPersistentTaintedMode(): TaintedMode {
  return v.persistent.taintedMode;
}

/** Set the persistent tainted-Deleted mode. */
export function setPersistentTaintedMode(mode: TaintedMode): void {
  v.persistent.taintedMode = mode;
}

/** If changing to a deleted PlayerType, sets them up appropriately. */
export function postPlayerChangeTypeMode(
  player: EntityPlayer,
  oldCharacter: PlayerType,
  newCharacter: PlayerType,
): void {
  const newMode = getModeFromPlayerType(newCharacter);
  if (newMode !== undefined) {
    setPlayerMode(player, newMode);
  }
}
