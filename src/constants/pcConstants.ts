import { Mode } from "../enums/modes/Mode";

/**
 * Represents the 'character wheel' for non-Tainted modes. First and last index in the array would
 * theoretically wrap around.
 */

export const NormalModeCarousel = [
  Mode.HAPPY_99,
  Mode.ILOVEYOU,
  Mode.MORRIS,
  Mode.ZIPBOMBER,
  Mode.CRYPTOLOCKER,
  Mode.SPYWIPER,
  Mode.JERUSALEM,
  Mode.HICURDISMOS,
  Mode.VCS,
  Mode.MEMZ,
  Mode.MYDOOM,
  Mode.REVETON,
];

/**
 * Represents the 'character wheel' for Tainted modes. First and last index in the array would
 * theoretically wrap around.
 */

export const TaintedModeCarousel = [Mode.SOPHOS, Mode.BATTLEYE];
