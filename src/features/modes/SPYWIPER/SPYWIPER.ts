import { getPlayerIndex } from "isaacscript-common";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.SPYWIPER;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const MODE_DATA = getModeData(MODE)!;

export function spywiperInit(): void {
  mod.saveDataManager("spywiper", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function spywiperModeSetup(player: EntityPlayer): void {
  fprint(`SPYWIPER: Mode init for player: ${getPlayerIndex(player)}`);
}

/** When the player swaps out from HAPPY99 mode. */
export function spywiperModeFin(player: EntityPlayer): void {}
