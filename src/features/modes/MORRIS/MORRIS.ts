import { getPlayerIndex } from "isaacscript-common";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.MORRIS;
const MODE_DATA = getModeData(MODE);

export function happy99Init(): void {
  mod.saveDataManager("morris", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function morrisModeSetup(player: EntityPlayer): void {
  fprint(`MORRIS: Mode init for player: ${getPlayerIndex(player)}`);
}
