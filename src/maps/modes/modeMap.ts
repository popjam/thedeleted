import { PlayerType, SoundEffect } from "isaac-typescript-definitions";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { SoundEffectCustom } from "../../enums/general/SoundEffectCustom";
import { Mode } from "../../enums/modes/Mode";
import { fprint } from "../../helper/printHelper";
import { ModeData } from "../../interfaces/modes/ModeData";
import { BATTLEYEData } from "../../objects/modes/BATTLEYEData";
import { CRYPTOLOCKERData } from "../../objects/modes/CRYPTOLOCKERData";
import { HAPPY99Data } from "../../objects/modes/HAPPY99Data";
import { HICURDISMOSData } from "../../objects/modes/HICURDISMOSData";
import { ILOVEYOUData } from "../../objects/modes/ILOVEYOUData";
import { JERUSALEMData } from "../../objects/modes/JERUSALEMData";
import { MEMZData } from "../../objects/modes/MEMZData";
import { MORRISData } from "../../objects/modes/MORRISData";
import { MYDOOMData } from "../../objects/modes/MYDOOMData";
import { REVETONData } from "../../objects/modes/REVETONData";
import { SOPHOSData } from "../../objects/modes/SOPHOSData";
import { SPYWIPERData } from "../../objects/modes/SPYWIPERData";
import { VCSData } from "../../objects/modes/VCSData";
import { ZIPBOMBERData } from "../../objects/modes/ZIPBOMBERData";

/** Maps each Mode type to their respective data object. */
export const MODE_DATA_MAP: ReadonlyMap<Mode, ModeData> = new Map([
  [Mode.HAPPY99, HAPPY99Data],
  [Mode.ILOVEYOU, ILOVEYOUData],
  [Mode.MORRIS, MORRISData],
  [Mode.ZIPBOMBER, ZIPBOMBERData],
  [Mode.MYDOOM, MYDOOMData],
  [Mode.SOPHOS, SOPHOSData],
  [Mode.BATTLEYE, BATTLEYEData],
  [Mode.CRYPTOLOCKER, CRYPTOLOCKERData],
  [Mode.SPYWIPER, SPYWIPERData],
  [Mode.JERUSALEM, JERUSALEMData],
  [Mode.HICURDISMOS, HICURDISMOSData],
  [Mode.VCS, VCSData],
  [Mode.MEMZ, MEMZData],
  [Mode.MYDOOM, MYDOOMData],
  [Mode.REVETON, REVETONData],
]);

/** Maps each mode to their respective PlayerType. */
export const MODE_PLAYERTYPE_MAP: ReadonlyMap<Mode, PlayerType> = new Map([
  [Mode.HAPPY99, PlayerTypeCustom.DELETED_HAPPY99],
  [Mode.ILOVEYOU, PlayerTypeCustom.DELETED_ILOVEYOU],
  [Mode.MORRIS, PlayerTypeCustom.DELETED_MORRIS],
  [Mode.ZIPBOMBER, PlayerTypeCustom.DELETED_ZIPBOMBER],
  [Mode.CRYPTOLOCKER, PlayerTypeCustom.DELETED_CRYPTOLOCKER],
  [Mode.SPYWIPER, PlayerTypeCustom.DELETED_SPYWIPER],
  [Mode.JERUSALEM, PlayerTypeCustom.DELETED_JERUSALEM],
  [Mode.HICURDISMOS, PlayerTypeCustom.DELETED_HICURDISMOS],
  [Mode.MYDOOM, PlayerTypeCustom.DELETED_MYDOOM],
  [Mode.VCS, PlayerTypeCustom.DELETED_VCS],
  [Mode.MEMZ, PlayerTypeCustom.DELETED_MEMZ],
  [Mode.REVETON, PlayerTypeCustom.DELETED_REVETON],
  [Mode.SOPHOS, PlayerTypeCustom.T_DELETED_SOPHOS],
  [Mode.BATTLEYE, PlayerTypeCustom.T_DELETED_BATTLEYE],
]);

/** Maps each PlayerType to their respective Mode. */
export const PLAYERTYPE_MODE_MAP: ReadonlyMap<PlayerType, Mode> = new Map([
  [PlayerTypeCustom.DELETED_HAPPY99, Mode.HAPPY99],
  [PlayerTypeCustom.DELETED_ILOVEYOU, Mode.ILOVEYOU],
  [PlayerTypeCustom.DELETED_MORRIS, Mode.MORRIS],
  [PlayerTypeCustom.DELETED_ZIPBOMBER, Mode.ZIPBOMBER],
  [PlayerTypeCustom.DELETED_CRYPTOLOCKER, Mode.CRYPTOLOCKER],
  [PlayerTypeCustom.DELETED_SPYWIPER, Mode.SPYWIPER],
  [PlayerTypeCustom.DELETED_JERUSALEM, Mode.JERUSALEM],
  [PlayerTypeCustom.DELETED_HICURDISMOS, Mode.HICURDISMOS],
  [PlayerTypeCustom.DELETED_VCS, Mode.VCS],
  [PlayerTypeCustom.DELETED_MEMZ, Mode.MEMZ],
  [PlayerTypeCustom.DELETED_REVETON, Mode.REVETON],
  [PlayerTypeCustom.DELETED_MYDOOM, Mode.MYDOOM],
  [PlayerTypeCustom.T_DELETED_SOPHOS, Mode.SOPHOS],
  [PlayerTypeCustom.T_DELETED_BATTLEYE, Mode.BATTLEYE],
]);

export const MODE_VOICEOVER_MAP: ReadonlyMap<Mode, SoundEffect> = new Map([
  [Mode.HAPPY99, SoundEffectCustom.VO_HAPPY99],
  [Mode.ILOVEYOU, SoundEffectCustom.VO_ILOVEYOU],
  [Mode.MORRIS, SoundEffectCustom.VO_MORRIS],
  [Mode.ZIPBOMBER, SoundEffectCustom.VO_ZIPBOMBER],
  [Mode.CRYPTOLOCKER, SoundEffectCustom.VO_CRYPTOLOCKER],
  [Mode.SPYWIPER, SoundEffectCustom.VO_SPYWIPER],
  [Mode.JERUSALEM, SoundEffectCustom.VO_JERUSALEM],
  [Mode.HICURDISMOS, SoundEffectCustom.VO_HICURDISMOS],
  [Mode.MYDOOM, SoundEffectCustom.VO_MYDOOM],
  [Mode.VCS, SoundEffectCustom.VO_VCS],
  [Mode.MEMZ, SoundEffectCustom.VO_MEMZ],
  [Mode.REVETON, SoundEffectCustom.VO_REVETON],
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

/**
 * Retrieve the ModeData from the deleted player. Will error if the passed player is not of type
 * Deleted (tainted or non-tainted).
 */
export function getModeDataFromPlayer(player: EntityPlayer): ModeData {
  const mode = getModeFromPlayerType(player.GetPlayerType());
  if (mode === undefined) {
    error(`Failed to get the mode from the player type (${player.Type})`);
  }
  return getModeData(mode);
}

/** Get the narrators voiceover for the Mode, if it exists. */
export function getModeVoiceover(mode: Mode): SoundEffect | undefined {
  const voiceover = MODE_VOICEOVER_MAP.get(mode);
  if (voiceover !== undefined) {
    return voiceover;
  }
  fprint(`Voiceover for mode ${mode} does not exist!`);
  return undefined;
}
