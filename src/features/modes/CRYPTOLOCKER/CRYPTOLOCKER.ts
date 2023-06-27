import { getPlayerIndex } from "isaacscript-common";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.CRYPTOLOCKER;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const MODE_DATA = getModeData(MODE)!;

export function cryptolockerInit(): void {
  mod.saveDataManager("cryptolocker", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function cryptolockerModeSetup(player: EntityPlayer): void {
  fprint(`CRYPTOLOCKER: Mode init for player: ${getPlayerIndex(player)}`);
}

/** When the player swaps out from HAPPY99 mode. */
export function cryptolockerModeFin(player: EntityPlayer): void {}
