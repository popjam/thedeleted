import { newSprite } from "isaacscript-common";
import { switchToNextModeOnCarousel } from "../../helper/deletedSpecific/modeHelper";
import { renderSpriteInCenterOfScreen } from "../../helper/renderHelper";
import type { PCMenuState } from "../../interfaces/pc/PCMenuState";
import { PCMenu } from "../../enums/pc/PCMenu";
import { PC_MENU_SCALE } from "../../constants/pcConstants";
import { GAME_MENU_ANM2_PATH } from "../../constants/menuConstants";

/** Title screen, i.e 'Press Start' screen. */
export class PCGameMenuScreen implements PCMenuState {
  gameMenuSprite: Sprite | undefined;
  switchScreen: PCMenu | undefined;

  inputLeftButton(player: EntityPlayer): void {
    switchToNextModeOnCarousel(player, false);
  }

  inputRightButton(player: EntityPlayer): void {
    switchToNextModeOnCarousel(player);
  }

  inputUpButton(player: EntityPlayer): void {
    error("Method not implemented.");
  }

  inputDownButton(player: EntityPlayer): void {
    error("Method not implemented.");
  }

  inputMenuConfirmButton(player: EntityPlayer): void {
    this.switchScreen = PCMenu.CHARACTER_SELECT;
  }

  destroy(): void {
    if (this.gameMenuSprite !== undefined) {
      this.gameMenuSprite = undefined;
    }

    this.switchScreen = undefined;
  }

  render(): void {
    if (this.gameMenuSprite === undefined) {
      this.gameMenuSprite = newSprite(GAME_MENU_ANM2_PATH);
      this.gameMenuSprite.Scale = Vector(PC_MENU_SCALE, PC_MENU_SCALE);
    }

    if (Isaac.GetFrameCount() % 2 === 0) {
    }

    renderSpriteInCenterOfScreen(this.gameMenuSprite);
  }
}
