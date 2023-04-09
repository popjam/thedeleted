import { getPlayerIndex } from "isaacscript-common";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.MYDOOM;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const MODE_DATA = getModeData(MODE)!;

export function mydoomInit(): void {
  mod.saveDataManager("mydoom", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function mydoomModeSetup(player: EntityPlayer): void {
  fprint(`MYDOOM: Mode init for player: ${getPlayerIndex(player)}`);
}

/** When the player swaps out from HAPPY99 mode. */
export function mydoomModeFin(player: EntityPlayer): void {}
