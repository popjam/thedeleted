import { PCCharacterScreen } from "../../classes/pc/PCCharacterScreen";
import { PCGameMenuScreen } from "../../classes/pc/PCGameMenuScreen";
import { PCSaveScreen } from "../../classes/pc/PCSaveScreen";
import { PCTitleScreen } from "../../classes/pc/PCTitleScreen";
import { PCMenu } from "../../enums/pc/PCMenu";
import type { PCMenuState } from "../../interfaces/pc/PCMenuState";

const PC_MENU_TO_PC_MENU_CLASS_MAP = new Map<PCMenu, PCMenuState>([
  [PCMenu.TITLE, new PCTitleScreen()],
  [PCMenu.SAVE, new PCSaveScreen()],
  [PCMenu.GAME_MENU, new PCGameMenuScreen()],
  [PCMenu.CHARACTER_SELECT, new PCCharacterScreen()],
]);

export function getPCMenuClass(menu: PCMenu): PCMenuState {
  const menuClass = PC_MENU_TO_PC_MENU_CLASS_MAP.get(menu);
  if (menuClass === undefined) {
    error(`No PCMenu class found for menu: ${menu}`);
  }

  return menuClass;
}
