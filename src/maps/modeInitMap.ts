import { Mode } from "../enums/modes/Mode";
import { happy99ModeInit } from "../features/modes/HAPPY99/HAPPY99";

/** Maps each Mode type to their respective data object. */
export const MODE_INIT_MAP: ReadonlyMap<Mode, (player: EntityPlayer) => void> =
  new Map([[Mode.HAPPY99, (player: EntityPlayer) => happy99ModeInit(player)]]);
