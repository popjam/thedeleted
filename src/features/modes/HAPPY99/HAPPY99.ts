import { getPlayerIndex } from "isaacscript-common";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.HAPPY99;
const MODE_DATA = getModeData(MODE);

export function happy99Init(): void {
  mod.saveDataManager("happy99", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function happy99ModeSetup(player: EntityPlayer): void {
  fprint(`HAPPY99: Mode init for player: ${getPlayerIndex(player)}`);
}
