import {
  getPlayerIndex,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { Mode } from "../../enums/modes/Mode";
import { setBombs } from "../../helper/playerHelper";
import { MODE_MAP } from "../../maps/modeMap";
import { NormalMode, TaintedMode } from "../../types/ModeType";
import { getStartingBombsSetting } from "../settings/consumableSettings";
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

/** Set the real mode of the deleted player. */
export function setCurrentMode(player: EntityPlayer, mode: Mode): void {
  v.run.currentMode.set(getPlayerIndex(player), mode);
  setPersistentNormalMode(mode);
  const modeData = MODE_MAP.get(mode)!;
  const { settings } = modeData;
  if (settings !== undefined) {
    addSettingsToPlayer(player, settings);
  }
  setBombs(player, getStartingBombsSetting(player));
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
