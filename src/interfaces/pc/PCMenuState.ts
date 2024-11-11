import type { PCMenu } from "../../enums/pc/PCMenu";

/**
 * Provides a template for PCMenu classes, which control behavior for the PC depending on the
 * current menu.
 */
export interface PCMenuState {
  switchScreen: PCMenu | undefined;
  bootUser?: true | undefined;
  inputLeftButton: (player: EntityPlayer) => void;
  inputRightButton: (player: EntityPlayer) => void;
  inputUpButton: (player: EntityPlayer) => void;
  inputDownButton: (player: EntityPlayer) => void;
  inputMenuConfirmButton: (player: EntityPlayer) => void;
  destroy: () => void;
  render: () => void;
}
