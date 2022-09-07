import { Mode } from "../enums/modes/Mode";
import { ModeData } from "../interfaces/corruption/ModeData";
import { HAPPY99Data } from "../objects/modes/HAPPY99Data";
import { MEMZData } from "../objects/modes/MEMZData";

/** Maps each Mode type to their respective data object. */
export const MODE_MAP: ReadonlyMap<Mode, ModeData> = new Map([
  [Mode.HAPPY99, HAPPY99Data],
  // [Mode.ILOVEYOU, ILOVEYOUData], [Mode.MORRIS, MORRISData], [Mode.ZIPBOMBER, ZIPBOMBERData],
  // [Mode.CRYPTOLOCKER, CRYPTOLOCKERData], [Mode.SPYWIPER, SPYWIPERData], [Mode.JERUSALEM,
  // JERUSALEMData], [Mode.HICURDISMOS, HICURDISMOSData], [Mode.VCS, VCSData],
  [Mode.MEMZ, MEMZData],
  // [Mode.MYDOOM, MYDOOMData], [Mode.REVETON, REVETONData],
]);
