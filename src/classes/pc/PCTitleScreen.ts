import { newSprite } from "isaacscript-common";
import { switchToNextModeOnCarousel } from "../../helper/deletedSpecific/modeHelper";
import { renderSpriteInCenterOfScreen } from "../../helper/renderHelper";
import type { PCMenuState } from "../../interfaces/pc/PCMenuState";
import { PCMenu } from "../../enums/pc/PCMenu";
import { PC_MENU_SCALE } from "../../constants/pcConstants";
import { TITLE_MENU_ANM2_PATH } from "../../constants/menuConstants";

/** Title screen, i.e 'Press Start' screen. */
export class PCTitleScreen implements PCMenuState {
  menuSprite: Sprite | undefined;
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
    this.switchScreen = PCMenu.SAVE;
  }

  destroy(): void {
    if (this.menuSprite !== undefined) {
      this.menuSprite = undefined;
    }

    this.switchScreen = undefined;
  }

  render(): void {
    if (this.menuSprite === undefined) {
      this.menuSprite = newSprite(TITLE_MENU_ANM2_PATH);
      this.menuSprite.Scale = Vector(PC_MENU_SCALE, PC_MENU_SCALE);
    }

    if (Isaac.GetFrameCount() % 2 === 0) {
      this.menuSprite.Update();
    }

    renderSpriteInCenterOfScreen(this.menuSprite);
  }
}
