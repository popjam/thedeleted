import { Mode } from "../../enums/modes/Mode";
import { ModeData } from "../../interfaces/modes/ModeData";
import { HAPPY99Data } from "../../objects/modes/HAPPY99Data";
import { MEMZData } from "../../objects/modes/MEMZData";

/** Maps each Mode type to their respective data object. */
const MODE_MAP: ReadonlyMap<Mode, ModeData> = new Map([
  [Mode.HAPPY99, HAPPY99Data],
  // [Mode.ILOVEYOU, ILOVEYOUData], [Mode.MORRIS, MORRISData], [Mode.ZIPBOMBER, ZIPBOMBERData],
  // [Mode.CRYPTOLOCKER, CRYPTOLOCKERData], [Mode.SPYWIPER, SPYWIPERData], [Mode.JERUSALEM,
  // JERUSALEMData], [Mode.HICURDISMOS, HICURDISMOSData], [Mode.VCS, VCSData],
  [Mode.MEMZ, MEMZData],
  // [Mode.MYDOOM, MYDOOMData], [Mode.REVETON, REVETONData],
]);

/** Retrieve a Mode's ModeData. */
export function getModeData(mode: Mode): ModeData {
  const modeData = MODE_MAP.get(mode);
  if (modeData !== undefined) {
    return modeData;
  }
  throw new Error(`Mode data for mode ${mode} does not exist!`);
}
