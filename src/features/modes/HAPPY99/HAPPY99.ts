import { getPlayerIndex, saveDataManager } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { HAPPY99Data } from "../../../objects/modes/HAPPY99Data";
import { addSettingsToPlayer } from "../../settings/mainSettings";

const v = {};
const MODE = Mode.HAPPY99;
const MODE_DATA = HAPPY99Data;

export function happy99Init(): void {
  saveDataManager("happy99", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function happy99ModeInit(player: EntityPlayer): void {
  fprint(`HAPPY99: Mode init for player: ${getPlayerIndex(player)}`);
  player.SetPocketActiveItem(CollectibleTypeCustom.BITFLIP);
  const { settings } = MODE_DATA;
  if (settings !== undefined) {
    addSettingsToPlayer(player, settings);
  }
}

/** Initiate the player to be HAPPY99 in the MEMZ mode. */
export function happy99MemzInit(player: EntityPlayer): void {}
