import { PlayerType } from "isaac-typescript-definitions";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { Mode } from "../../enums/modes/Mode";
import { ModeData } from "../../interfaces/modes/ModeData";
import { BATTLEYEData } from "../../objects/modes/BATTLEYEData";
import { HAPPY99Data } from "../../objects/modes/HAPPY99Data";
import { ILOVEYOUData } from "../../objects/modes/ILOVEYOUData";
import { MORRISData } from "../../objects/modes/MORRISData";
import { SOPHOSData } from "../../objects/modes/SOPHOSData";
import { ZIPBOMBERData } from "../../objects/modes/ZIPBOMBERData";

/** Maps each Mode type to their respective data object. */
export const MODE_DATA_MAP: ReadonlyMap<Mode, ModeData> = new Map([
  [Mode.HAPPY99, HAPPY99Data],
  [Mode.ILOVEYOU, ILOVEYOUData],
  [Mode.MORRIS, MORRISData],
  [Mode.ZIPBOMBER, ZIPBOMBERData],
  [Mode.SOPHOS, SOPHOSData],
  [Mode.BATTLEYE, BATTLEYEData],
  // [Mode.ILOVEYOU, ILOVEYOUData], [Mode.MORRIS, MORRISData], [Mode.ZIPBOMBER, ZIPBOMBERData],
  // [Mode.CRYPTOLOCKER, CRYPTOLOCKERData], [Mode.SPYWIPER, SPYWIPERData], [Mode.JERUSALEM,
  // JERUSALEMData], [Mode.HICURDISMOS, HICURDISMOSData], [Mode.VCS, VCSData], [Mode.MEMZ,
  // MEMZData], [Mode.MYDOOM, MYDOOMData], [Mode.REVETON, REVETONData],
]);

/** Maps each mode to their respective PlayerType. */
export const MODE_PLAYERTYPE_MAP: ReadonlyMap<Mode, PlayerType> = new Map([
  [Mode.HAPPY99, PlayerTypeCustom.DELETED_HAPPY99],
  [Mode.ILOVEYOU, PlayerTypeCustom.DELETED_ILOVEYOU],
  [Mode.MORRIS, PlayerTypeCustom.DELETED_MORRIS],
  [Mode.ZIPBOMBER, PlayerTypeCustom.DELETED_ZIPBOMBER],
  [Mode.SOPHOS, PlayerTypeCustom.T_DELETED_SOPHOS],
  [Mode.BATTLEYE, PlayerTypeCustom.T_DELETED_BATTLEYE],
]);

/** Maps each PlayerType to their respective Mode. */
export const PLAYERTYPE_MODE_MAP: ReadonlyMap<PlayerType, Mode> = new Map([
  [PlayerTypeCustom.DELETED_HAPPY99, Mode.HAPPY99],
  [PlayerTypeCustom.DELETED_ILOVEYOU, Mode.ILOVEYOU],
  [PlayerTypeCustom.DELETED_MORRIS, Mode.MORRIS],
  [PlayerTypeCustom.DELETED_ZIPBOMBER, Mode.ZIPBOMBER],
  [PlayerTypeCustom.T_DELETED_SOPHOS, Mode.SOPHOS],
  [PlayerTypeCustom.T_DELETED_BATTLEYE, Mode.BATTLEYE],
]);

/** Retrieve a Mode's ModeData. */
export function getModeData(mode: Mode): ModeData {
  const modeData = MODE_DATA_MAP.get(mode);
  if (modeData !== undefined) {
    return modeData;
  }
  error(`Mode data for mode ${mode} does not exist!`);
}

/** Retrieve a Mode's PlayerType. */
export function getModePlayerType(mode: Mode): PlayerType {
  const playerType = MODE_PLAYERTYPE_MAP.get(mode);
  if (playerType !== undefined) {
    return playerType;
  }
  error(`Player type for mode ${mode} does not exist!`);
}

/** Retrieve the mode corresponding to the PlayerType. */
export function getModeFromPlayerType(
  playerType: PlayerType,
): Mode | undefined {
  return PLAYERTYPE_MODE_MAP.get(playerType);
}
