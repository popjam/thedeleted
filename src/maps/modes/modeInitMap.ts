import { Mode } from "../../enums/modes/Mode";
import { happy99ModeSetup } from "../../features/modes/HAPPY99/HAPPY99";
import { iLoveYouModeSetup } from "../../features/modes/ILOVEYOU/ILOVEYOU";
import { morrisModeSetup } from "../../features/modes/MORRIS/MORRIS";

/** Maps each Mode type to their respective data object. */
export const MODE_INIT_MAP: ReadonlyMap<Mode, (player: EntityPlayer) => void> =
  new Map([
    [Mode.HAPPY99, (player: EntityPlayer) => happy99ModeSetup(player)],
    [Mode.ILOVEYOU, (player: EntityPlayer) => iLoveYouModeSetup(player)],
    [Mode.MORRIS, (player: EntityPlayer) => morrisModeSetup(player)],
  ]);

/**
 * Returns the modes' initialization function, responsible for setting up the specific mode for the
 * first time.
 */
export function getModeInit(mode: Mode): (player: EntityPlayer) => void {
  const modeInit = MODE_INIT_MAP.get(mode);
  if (modeInit !== undefined) {
    return modeInit;
  }
  throw new Error("modeInitMap: Mode init not found!");
}
