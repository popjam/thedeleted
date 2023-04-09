import { Mode } from "../../enums/modes/Mode";
import {
  battleyeModeFin,
  battleyeModeSetup,
} from "../../features/modes/BATTLEYE/BATTLEYE";
import {
  happy99ModeFin,
  happy99ModeSetup,
} from "../../features/modes/HAPPY99/HAPPY99";
import {
  iLoveYouModeFin,
  iLoveYouModeSetup,
} from "../../features/modes/ILOVEYOU/ILOVEYOU";
import {
  morrisModeFin,
  morrisModeSetup,
} from "../../features/modes/MORRIS/MORRIS";
import {
  mydoomModeFin,
  mydoomModeSetup,
} from "../../features/modes/MYDOOM/MYDOOM";
import {
  sophosModeFin,
  sophosModeSetup,
} from "../../features/modes/SOPHOS/SOPHOS";
import {
  zipbomberModeFin,
  zipbomberModeSetup,
} from "../../features/modes/ZIPBOMBER/ZIPBOMBER";

/** Maps each Mode type to their respective setup function. */
const MODE_INIT_MAP: ReadonlyMap<Mode, (player: EntityPlayer) => void> =
  new Map([
    [Mode.HAPPY99, (player: EntityPlayer) => happy99ModeSetup(player)],
    [Mode.ILOVEYOU, (player: EntityPlayer) => iLoveYouModeSetup(player)],
    [Mode.MORRIS, (player: EntityPlayer) => morrisModeSetup(player)],
    [Mode.ZIPBOMBER, (player: EntityPlayer) => zipbomberModeSetup(player)],
    [Mode.MYDOOM, (player: EntityPlayer) => mydoomModeSetup(player)],
    [Mode.SOPHOS, (player: EntityPlayer) => sophosModeSetup(player)],
    [Mode.BATTLEYE, (player: EntityPlayer) => battleyeModeSetup(player)],
  ]);

/** Maps each Mode type to their respective finalization function. */
const MODE_FIN_MAP: ReadonlyMap<Mode, (player: EntityPlayer) => void> = new Map(
  [
    [Mode.HAPPY99, (player: EntityPlayer) => happy99ModeFin(player)],
    [Mode.ILOVEYOU, (player: EntityPlayer) => iLoveYouModeFin(player)],
    [Mode.MORRIS, (player: EntityPlayer) => morrisModeFin(player)],
    [Mode.ZIPBOMBER, (player: EntityPlayer) => zipbomberModeFin(player)],
    [Mode.MYDOOM, (player: EntityPlayer) => mydoomModeFin(player)],
    [Mode.SOPHOS, (player: EntityPlayer) => sophosModeFin(player)],
    [Mode.BATTLEYE, (player: EntityPlayer) => battleyeModeFin(player)],
  ],
);

/**
 * Returns the modes' initialization function, responsible for setting up the specific mode for the
 * first time.
 */
export function getModeInit(mode: Mode): (player: EntityPlayer) => void {
  const modeInit = MODE_INIT_MAP.get(mode);
  if (modeInit !== undefined) {
    return modeInit;
  }
  error("modeInitMap: Mode init not found!");
}

/**
 * Returns the modes' finalization function, responsible for handling any necessary closing features
 * once the mode is swapped out of.
 */
export function getModeFin(mode: Mode): (player: EntityPlayer) => void {
  const modeFin = MODE_FIN_MAP.get(mode);
  if (modeFin !== undefined) {
    return modeFin;
  }
  error("modeInitMap: Mode init not found!");
}
