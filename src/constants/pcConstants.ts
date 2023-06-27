import { Mode } from "../enums/modes/Mode";

/**
 * Represents the 'character wheel' for non-Tainted modes. First and last index in the array would
 * theoretically wrap around.
 */
// eslint-disable-next-line isaacscript/require-capital-const-assertions, isaacscript/require-capital-read-only
export const NormalModeCarousel = [
  Mode.HAPPY99,
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
// eslint-disable-next-line isaacscript/require-capital-const-assertions, isaacscript/require-capital-read-only
export const TaintedModeCarousel = [Mode.SOPHOS, Mode.BATTLEYE];
