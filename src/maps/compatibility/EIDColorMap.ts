import { K_COLORS } from "isaacscript-common";
import { EIDColorShortcut } from "../../enums/compatibility/EIDColor";
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
      EIDColorShortcut.WORM_TURQUOISE,
      colorToKColor(DeletedColor.WORM_TURQUOISE),
    ],
    [EIDColorShortcut.ANGRY_RED, colorToKColor(DeletedColor.ANGRY_RED)],
    [EIDColorShortcut.DEATH_BLACK, colorToKColor(DeletedColor.DEATH_BLACK)],
  ]);

const EID_MORALITY_TO_COLOR_MAP: ReadonlyMap<Morality, string> = new Map([
  [Morality.POSITIVE, "ColorWhite"],
  [Morality.NEUTRAL, "ColorYellow"],
  [Morality.NEGATIVE, "ColorRed"],
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
