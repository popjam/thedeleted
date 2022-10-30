import { EntityFlag, EntityType } from "isaac-typescript-definitions";
import { getPlayerIndex, spawnNPC } from "isaacscript-common";
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

/** Initiate the player to the MORRIS mode. */
export function morrisModeSetup(player: EntityPlayer): void {
  fprint(`MORRIS: Mode init for player: ${getPlayerIndex(player)}`);
  spawnNPC(EntityType.SMALL_MAGGOT, 0, 0, player.Position).AddEntityFlags(
    EntityFlag.FRIENDLY,
  );
}

/** When the player swaps out from MORRIS mode. */
export function morrisModeFin(player: EntityPlayer): void {}
