import { ActiveSlot } from "isaac-typescript-definitions";
import {
  getPlayerIndex,
  PlayerIndex,
  saveDataManager,
  setActiveItem,
} from "isaacscript-common";
import { Mode } from "../../enums/modes/Mode";
import { setBombs, setCoins, setKeys } from "../../helper/playerHelper";
import { getModeData } from "../../maps/modes/modeMap";
import { NormalMode, TaintedMode } from "../../types/modes/ModeType";
import { addSettingsToPlayer } from "../settings/mainSettings";

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
  saveDataManager("mode", v);
}

/** Get the real mode of the deleted player. */
export function getCurrentMode(player: EntityPlayer): Mode | undefined {
  return v.run.currentMode.get(getPlayerIndex(player));
}

/** Set the current mode of the Deleted player. Set up any mode specific settings. */
export function setCurrentMode(player: EntityPlayer, mode: Mode): void {
  v.run.currentMode.set(getPlayerIndex(player), mode);
  setPersistentNormalMode(mode);
  // Setup player.
  const modeData = getModeData(mode);
  const { settings } = modeData;
  if (settings !== undefined) {
    addSettingsToPlayer(player, settings);
  }
  setBombs(player, modeData.startingBombs);
  setKeys(player, modeData.startingKeys);
  setCoins(player, modeData.startingCoins);
  if (modeData.startingPocket !== undefined) {
    setActiveItem(player, modeData.startingPocket, ActiveSlot.POCKET);
  }
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
