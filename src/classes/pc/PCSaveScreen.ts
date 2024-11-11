import { copyVector, newSprite } from "isaacscript-common";
import { renderSpriteInCenterOfScreen } from "../../helper/renderHelper";
import type { PCMenuState } from "../../interfaces/pc/PCMenuState";
import { PCMenu } from "../../enums/pc/PCMenu";
import { MENU_SPRITE_SIZE, PC_MENU_SCALE } from "../../constants/pcConstants";
import {
  SAVE_MENU_ANM2_PATH,
  SAVE_MENU_DRAWING_ANM2_PATH,
} from "../../constants/menuConstants";
import { fprint } from "../../helper/printHelper";
import { SaveFileType } from "../../enums/progression/SaveFileType";

const SAVE_FILE_DRAWING_HORIZONTAL_GAP = 150 * PC_MENU_SCALE;
const SAVE_FILE_DRAWING_VERTICAL_OFFSET = 40 * PC_MENU_SCALE;
const SAVE_FILE_DRAWING_SELECTED_VERTICAL_OFFSET = 50 * PC_MENU_SCALE;

/** Title screen, i.e 'Press Start' screen. */
export class PCSaveScreen implements PCMenuState {
  menuSprite: Sprite | undefined;
  switchScreen: PCMenu | undefined;
  saveImageSprite: Sprite | undefined;
  currentlySelectedSaveFile = SaveFileType.NORMAL;

  inputLeftButton(_player: EntityPlayer): void {
    // Switch to the previous save file, or wrap around to the last save file.
    if (this.currentlySelectedSaveFile === SaveFileType.NORMAL) {
      this.currentlySelectedSaveFile = SaveFileType.IMPOSSIBLE;
    } else {
      this.currentlySelectedSaveFile--;
    }
  }

  inputRightButton(_player: EntityPlayer): void {
    // Switch to the next save file, or wrap around to the first save file.
    if (this.currentlySelectedSaveFile === SaveFileType.IMPOSSIBLE) {
      this.currentlySelectedSaveFile = SaveFileType.NORMAL;
    } else {
      this.currentlySelectedSaveFile++;
    }
  }

  inputUpButton(player: EntityPlayer): void {
    error("Method not implemented.");
  }

  inputDownButton(player: EntityPlayer): void {
    error("Method not implemented.");
  }

  inputMenuConfirmButton(_player: EntityPlayer): void {
    this.switchScreen = PCMenu.GAME_MENU;
  }

  destroy(): void {
    if (this.menuSprite !== undefined) {
      this.menuSprite = undefined;
    }

    if (this.saveImageSprite !== undefined) {
      this.saveImageSprite = undefined;
    }

    this.currentlySelectedSaveFile = SaveFileType.NORMAL;
    this.switchScreen = undefined;
  }

  getSelectedSaveFileAnimation(): string {
    return `File${this.currentlySelectedSaveFile}Deselect`;
  }

  render(): void {
    if (this.menuSprite === undefined) {
      this.menuSprite = newSprite(SAVE_MENU_ANM2_PATH);
      this.menuSprite.Scale = Vector(PC_MENU_SCALE, PC_MENU_SCALE);

      // First frame highlights File 1.
      this.menuSprite.Play(this.getSelectedSaveFileAnimation(), true);
    }

    // If there is a mismatch between the current animation and the selected save file, switch to
    // the correct animation.
    if (
      this.menuSprite.GetAnimation() !== this.getSelectedSaveFileAnimation()
    ) {
      fprint(
        `Switching to ${this.getSelectedSaveFileAnimation()} from ${this.menuSprite.GetAnimation()}`,
      );
      this.menuSprite.Play(this.getSelectedSaveFileAnimation(), true);
    }

    if (this.saveImageSprite === undefined) {
      this.saveImageSprite = newSprite(SAVE_MENU_DRAWING_ANM2_PATH);
      this.saveImageSprite.Play("Animated", true);
      this.saveImageSprite.Scale = Vector(PC_MENU_SCALE, PC_MENU_SCALE);
    }

    if (Isaac.GetFrameCount() % 2 === 0) {
      this.saveImageSprite.Update();
    }

    // Due to the Save Screen anm2 not having proper size, use the default Menu Screen size.
    const size = copyVector(MENU_SPRITE_SIZE).mul(this.menuSprite.Scale);

    renderSpriteInCenterOfScreen(this.menuSprite, size);

    // Loop through save files and render them.
    for (let i = 1; i <= 3; i++) {
      renderSpriteInCenterOfScreen(
        this.saveImageSprite,
        undefined,
        Vector(
          (i - 2) * SAVE_FILE_DRAWING_HORIZONTAL_GAP,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
          i === this.currentlySelectedSaveFile
            ? -SAVE_FILE_DRAWING_SELECTED_VERTICAL_OFFSET
            : -SAVE_FILE_DRAWING_VERTICAL_OFFSET,
        ),
      );
    }
  }
}
