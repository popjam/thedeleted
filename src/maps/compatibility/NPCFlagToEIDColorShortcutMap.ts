import type { ChampionColor } from "isaac-typescript-definitions";
import { ReadonlyMap } from "isaacscript-common";
import { EIDColorShortcut } from "../../enums/compatibility/EID/EIDColor";
import { NPCFlag } from "../../enums/general/NPCFlag";

const NPCFlagToEIDColorShortcutMap = new ReadonlyMap<NPCFlag, EIDColorShortcut>(
  [[NPCFlag.BOLSTERED, EIDColorShortcut.CHAMPION_BLACK]],
);
