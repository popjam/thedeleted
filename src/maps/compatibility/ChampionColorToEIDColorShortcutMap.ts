import { ChampionColor } from "isaac-typescript-definitions";
import { ReadonlyMap } from "isaacscript-common";
import { EIDColorShortcut } from "../../enums/compatibility/EID/EIDColor";

const ChampionColorToEIDColorShortcutMap = new ReadonlyMap<
  ChampionColor,
  EIDColorShortcut
>([
  [ChampionColor.BLACK, EIDColorShortcut.CHAMPION_BLACK],
  [ChampionColor.BLUE, EIDColorShortcut.CHAMPION_BLUE],
]);

/** Get the EIDColorShortcut from the NPCs champion color. */
export function getEIDColorShortcutFromChampionColor(
  championColor: ChampionColor,
): EIDColorShortcut | undefined {
  const color = ChampionColorToEIDColorShortcutMap.get(championColor);
  if (color !== undefined) {
    return color;
  }

  return undefined;
}
