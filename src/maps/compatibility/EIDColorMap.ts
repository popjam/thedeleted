import { K_COLORS } from "isaacscript-common";
import { EIDColorShortcut } from "../../enums/compatibility/EID/EIDColor";
import { EIDColorTriplet } from "../../enums/compatibility/EID/EIDColorTriplet";
import { Morality } from "../../enums/corruption/Morality";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { colorToKColor } from "../../helper/colorHelper";

const EID_COLOR_MAP: ReadonlyMap<EIDColorShortcut, KColor | (() => KColor)> =
  new Map([
    [EIDColorShortcut.RED, K_COLORS.Red],
    [EIDColorShortcut.HAPPY_YELLOW, colorToKColor(DeletedColor.HAPPY_YELLOW)],
    [
      EIDColorShortcut.HAPPY_YELLOW_DARKER,
      colorToKColor(DeletedColor.HAPPY_YELLOW_DARKER),
    ],
    [
      EIDColorShortcut.HAPPY_YELLOW_DARKEST,
      colorToKColor(DeletedColor.HAPPY_YELLOW_DARKEST),
    ],
    [EIDColorShortcut.LOVE_PINK, colorToKColor(DeletedColor.LOVE_PINK)],
    [
      EIDColorShortcut.LOVE_PINK_DARKER,
      colorToKColor(DeletedColor.LOVE_PINK_DARKER),
    ],
    [
      EIDColorShortcut.LOVE_PINK_DARKEST,
      colorToKColor(DeletedColor.LOVE_PINK_DARKEST),
    ],
    [
      EIDColorShortcut.WORM_TURQUOISE,
      colorToKColor(DeletedColor.WORM_TURQUOISE),
    ],
    [
      EIDColorShortcut.WORM_TURQUOISE_DARKER,
      colorToKColor(DeletedColor.WORM_TURQUOISE_DARKER),
    ],
    [
      EIDColorShortcut.WORM_TURQUOISE_DARKEST,
      colorToKColor(DeletedColor.WORM_TURQUOISE_DARKEST),
    ],
    [EIDColorShortcut.ANGRY_RED, colorToKColor(DeletedColor.ANGRY_RED)],
    [EIDColorShortcut.WINDOWS_BLUE, colorToKColor(DeletedColor.WINDOWS_BLUE)],
    [
      EIDColorShortcut.WINDOWS_BLUE_DARKER,
      colorToKColor(DeletedColor.WINDOWS_BLUE_DARKER),
    ],
    [
      EIDColorShortcut.WINDOWS_BLUE_DARKEST,
      colorToKColor(DeletedColor.WINDOWS_BLUE_DARKEST),
    ],
    [EIDColorShortcut.WINDOWS_WHITE, colorToKColor(DeletedColor.WINDOWS_WHITE)],
    [EIDColorShortcut.DEATH_BLACK, colorToKColor(DeletedColor.DEATH_BLACK)],
    [
      EIDColorShortcut.DEATH_BLACK_DARKER,
      colorToKColor(DeletedColor.DEATH_BLACK_DARKER),
    ],
    [
      EIDColorShortcut.DEATH_BLACK_DARKEST,
      colorToKColor(DeletedColor.DEATH_BLACK_DARKEST),
    ],
    [EIDColorShortcut.REVETON_RED, colorToKColor(DeletedColor.REVETON_RED)],
    [EIDColorShortcut.REVETON_BLUE, colorToKColor(DeletedColor.REVETON_BLUE)],
  ]);

const EID_MORALITY_TO_COLOR_MAP: ReadonlyMap<Morality, string> = new Map([
  [Morality.POSITIVE, "ColorWhite"],
  [Morality.NEUTRAL, "ColorYellow"],
  [Morality.NEGATIVE, "ColorRed"],
]);

const EID_COLOR_TRIPLET_TO_TUPLE_MAP: ReadonlyMap<
  EIDColorTriplet,
  [EIDColorShortcut, EIDColorShortcut, EIDColorShortcut]
> = new Map([
  [
    EIDColorTriplet.HAPPY99_TRIPLET,
    [
      EIDColorShortcut.HAPPY_YELLOW,
      EIDColorShortcut.HAPPY_YELLOW_DARKER,
      EIDColorShortcut.HAPPY_YELLOW_DARKEST,
    ],
  ],
  [
    EIDColorTriplet.ILOVEYOU_TRIPLET,
    [
      EIDColorShortcut.LOVE_PINK,
      EIDColorShortcut.LOVE_PINK_DARKER,
      EIDColorShortcut.LOVE_PINK_DARKEST,
    ],
  ],
  [
    EIDColorTriplet.MORRIS_TRIPLET,
    [
      EIDColorShortcut.WORM_TURQUOISE,
      EIDColorShortcut.WORM_TURQUOISE_DARKER,
      EIDColorShortcut.WORM_TURQUOISE_DARKEST,
    ],
  ],
  [
    EIDColorTriplet.HICURDISMOS_TRIPLET,
    [
      EIDColorShortcut.WINDOWS_BLUE,
      EIDColorShortcut.WINDOWS_BLUE_DARKER,
      EIDColorShortcut.WINDOWS_WHITE,
    ],
  ],
  [
    EIDColorTriplet.MYDOOM_TRIPLET,
    [
      EIDColorShortcut.DEATH_BLACK,
      EIDColorShortcut.DEATH_BLACK_DARKER,
      EIDColorShortcut.DEATH_BLACK_DARKEST,
    ],
  ],
]);

/** Returns the KColor for the given EIDColorShortcut. */
export function getKColorFromEIDColorShortcut(
  shortcut: EIDColorShortcut,
): KColor | (() => KColor) {
  const color = EID_COLOR_MAP.get(shortcut);
  if (color === undefined) {
    return error(`No KColor found for EIDColorShortcut: ${shortcut}`);
  }
  return color;
}

/** Returns the EIDColorShortcut for the given Morality. */
export function getEIDColorShortcutFromMorality(
  morality: Morality,
): EIDColorShortcut {
  const color = EID_MORALITY_TO_COLOR_MAP.get(morality);
  if (color === undefined) {
    return error(`No EIDColorShortcut found for Morality: ${morality}`);
  }
  return color as EIDColorShortcut;
}

/**
 * Retrieves a set of EIDColorShortcuts from the EIDColorTriplet enum value. This can be used with
 * the 'setTheme' ActionSet function.
 */
export function getEIDColorTupleFromTriplet(
  triplet: EIDColorTriplet,
): [EIDColorShortcut, EIDColorShortcut, EIDColorShortcut] {
  const tuple = EID_COLOR_TRIPLET_TO_TUPLE_MAP.get(triplet);
  if (tuple === undefined) {
    return error(`No EIDColorTuple found for EIDColorTriplet: ${triplet}`);
  }
  return tuple;
}
