import { Mode } from "../../enums/modes/Mode";
import {
  battleyeModeFin,
  battleyeModeSetup,
} from "../../features/modes/BATTLEYE/BATTLEYE";
import {
  cryptolockerModeFin,
  cryptolockerModeSetup,
} from "../../features/modes/CRYPTOLOCKER/CRYPTOLOCKER";
import {
  happy99ModeFin,
  happy99ModeSetup,
} from "../../features/modes/HAPPY99/HAPPY99";
import {
  hicurdismosModeFin,
  hicurdismosModeSetup,
} from "../../features/modes/HICURDISMOS/HICURDISMOS";
import {
  iLoveYouModeFin,
  iLoveYouModeSetup,
} from "../../features/modes/ILOVEYOU/ILOVEYOU";
import {
  jerusalemModeFin,
  jerusalemModeSetup,
} from "../../features/modes/JERUSALEM/JERUSALEM";
import { memzModeFin, memzModeInit } from "../../features/modes/MEMZ/MEMZ";
import {
  morrisModeFin,
  morrisModeSetup,
} from "../../features/modes/MORRIS/MORRIS";
import {
  mydoomModeFin,
  mydoomModeSetup,
} from "../../features/modes/MYDOOM/MYDOOM";
import {
  revetonModeFin,
  revetonModeSetup,
} from "../../features/modes/REVETON/REVETON";
import {
  sophosModeFin,
  sophosModeSetup,
} from "../../features/modes/SOPHOS/SOPHOS";
import {
  spywiperModeFin,
  spywiperModeSetup,
} from "../../features/modes/SPYWIPER/SPYWIPER";
import { vcsModeFin, vcsModeSetup } from "../../features/modes/VCS/VCS";
import {
  zipbomberModeFin,
  zipbomberModeSetup,
} from "../../features/modes/ZIPBOMBER/ZIPBOMBER";

/** Maps each Mode type to their respective setup function. */
const MODE_INIT_MAP: ReadonlyMap<Mode, (player: EntityPlayer) => void> =
  new Map([
    [
      Mode.HAPPY99,
      (player: EntityPlayer) => {
        happy99ModeSetup(player);
      },
    ],
    [
      Mode.ILOVEYOU,
      (player: EntityPlayer) => {
        iLoveYouModeSetup(player);
      },
    ],
    [
      Mode.MORRIS,
      (player: EntityPlayer) => {
        morrisModeSetup(player);
      },
    ],
    [
      Mode.ZIPBOMBER,
      (player: EntityPlayer) => {
        zipbomberModeSetup(player);
      },
    ],
    [
      Mode.MYDOOM,
      (player: EntityPlayer) => {
        mydoomModeSetup(player);
      },
    ],
    [
      Mode.CRYPTOLOCKER,
      (player: EntityPlayer) => {
        cryptolockerModeSetup(player);
      },
    ],
    [
      Mode.SPYWIPER,
      (player: EntityPlayer) => {
        spywiperModeSetup(player);
      },
    ],
    [
      Mode.REVETON,
      (player: EntityPlayer) => {
        revetonModeSetup(player);
      },
    ],
    [
      Mode.HICURDISMOS,
      (player: EntityPlayer) => {
        hicurdismosModeSetup(player);
      },
    ],
    [
      Mode.JERUSALEM,
      (player: EntityPlayer) => {
        jerusalemModeSetup(player);
      },
    ],
    [
      Mode.VCS,
      (player: EntityPlayer) => {
        vcsModeSetup(player);
      },
    ],
    [
      Mode.REVETON,
      (player: EntityPlayer) => {
        revetonModeSetup(player);
      },
    ],
    [
      Mode.MEMZ,
      (player: EntityPlayer) => {
        memzModeInit(player);
      },
    ],
    [
      Mode.SOPHOS,
      (player: EntityPlayer) => {
        sophosModeSetup(player);
      },
    ],
    [
      Mode.BATTLEYE,
      (player: EntityPlayer) => {
        battleyeModeSetup(player);
      },
    ],
  ]);

/** Maps each Mode type to their respective finalization function. */
const MODE_FIN_MAP: ReadonlyMap<Mode, (player: EntityPlayer) => void> = new Map(
  [
    [
      Mode.HAPPY99,
      (player: EntityPlayer) => {
        happy99ModeFin(player);
      },
    ],
    [
      Mode.ILOVEYOU,
      (player: EntityPlayer) => {
        iLoveYouModeFin(player);
      },
    ],
    [
      Mode.MORRIS,
      (player: EntityPlayer) => {
        morrisModeFin(player);
      },
    ],
    [
      Mode.ZIPBOMBER,
      (player: EntityPlayer) => {
        zipbomberModeFin(player);
      },
    ],
    [
      Mode.MYDOOM,
      (player: EntityPlayer) => {
        mydoomModeFin(player);
      },
    ],
    [
      Mode.CRYPTOLOCKER,
      (player: EntityPlayer) => {
        cryptolockerModeFin(player);
      },
    ],
    [
      Mode.SPYWIPER,
      (player: EntityPlayer) => {
        spywiperModeFin(player);
      },
    ],
    [
      Mode.REVETON,
      (player: EntityPlayer) => {
        revetonModeFin(player);
      },
    ],
    [
      Mode.HICURDISMOS,
      (player: EntityPlayer) => {
        hicurdismosModeFin(player);
      },
    ],
    [
      Mode.JERUSALEM,
      (player: EntityPlayer) => {
        jerusalemModeFin(player);
      },
    ],
    [
      Mode.VCS,
      (player: EntityPlayer) => {
        vcsModeFin(player);
      },
    ],
    [
      Mode.REVETON,
      (player: EntityPlayer) => {
        revetonModeFin(player);
      },
    ],
    [
      Mode.MEMZ,
      (player: EntityPlayer) => {
        memzModeFin(player);
      },
    ],
    [
      Mode.SOPHOS,
      (player: EntityPlayer) => {
        sophosModeFin(player);
      },
    ],
    [
      Mode.BATTLEYE,
      (player: EntityPlayer) => {
        battleyeModeFin(player);
      },
    ],
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
