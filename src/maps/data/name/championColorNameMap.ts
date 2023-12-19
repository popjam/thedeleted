import { ChampionColor } from "isaac-typescript-definitions";

const ChampionColorNameMap: ReadonlyMap<ChampionColor, string> = new Map([
  [ChampionColor.BLACK, "Black"],
  [ChampionColor.BLUE, "Blue"],
  [ChampionColor.CAMO, "Camouflaged"],
  [ChampionColor.DARK_RED, "Dark Red"],
  [ChampionColor.FLICKER, "Flickering"],
  [ChampionColor.GREEN, "Green"],
  [ChampionColor.GREY, "Grey"],
  [ChampionColor.LIGHT_BLUE, "Light Blue"],
  [ChampionColor.ORANGE, "Orange"],
  [ChampionColor.PINK, "Pink"],
  [ChampionColor.PULSE_GREEN, "Pulsating Green"],
  [ChampionColor.PULSE_GREY, "Pulsating Grey"],
  [ChampionColor.PURPLE, "Purple"],
  [ChampionColor.RED, "Red"],
  [ChampionColor.TRANSPARENT, "Transparent"],
  [ChampionColor.WHITE, "White"],
  [ChampionColor.YELLOW, "Yellow"],
  [ChampionColor.BROWN, "Brown"],
  [ChampionColor.RAINBOW, "Rainbow"],
  [ChampionColor.DEATH, "Death"],
  [ChampionColor.KING, "King"],
  [ChampionColor.SIZE_PULSE, "Size-Pulsating"],
  [ChampionColor.PULSE_RED, "Pulsating Red"],
  [ChampionColor.GIANT, "Giant"],
  [ChampionColor.TINY, "Tiny"],
  [ChampionColor.FLY_PROTECTED, "Fly Protected"],
  [ChampionColor.DARK_RED, "Dark Red"],
]);

/**
 * Converts a ChampionColor to a printable text value.
 *
 * @example getChampionColorTextFromMap(ChampionColor.BLACK); // "Black"
 */
export function getChampionColorTextFromMap(
  championColor: ChampionColor,
): string {
  const text = ChampionColorNameMap.get(championColor);
  if (text !== undefined) {
    return text;
  }
  error("ChampionColorText: ChampionColor text cannot be found.");
}
