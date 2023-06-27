import { getPlayerIndex, isEven } from "isaacscript-common";
import { DeletedColor } from "../../../enums/general/DeletedColor";
import { Mode } from "../../../enums/modes/Mode";
import { isPlayerDeleted } from "../../../helper/deletedSpecific/deletedHelper";
import { fprint } from "../../../helper/printHelper";
import {
  getModeData,
  getModeFromPlayerType,
} from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.REVETON;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const MODE_DATA = getModeData(MODE)!;

let tearsFired = 0;

export function revetonInit(): void {
  mod.saveDataManager("reveton", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function revetonModeSetup(player: EntityPlayer): void {
  fprint(`REVETON: Mode init for player: ${getPlayerIndex(player)}`);
}

/** When the player swaps out from HAPPY99 mode. */
export function revetonModeFin(player: EntityPlayer): void {}

export function revetonPostFireTear(tear: EntityTear): void {
  const player = tear.Parent?.ToPlayer();
  if (player === undefined) {
    return;
  }

  if (!isPlayerDeleted(player)) {
    return;
  }

  if (getModeFromPlayerType(player.GetPlayerType()) !== MODE) {
    return;
  }

  tearsFired++;
  if (isEven(tearsFired)) {
    tear.SetColor(DeletedColor.REVETON_BLUE, 0, 1);
  } else {
    tear.SetColor(DeletedColor.REVETON_RED, 0, 1);
  }
}
