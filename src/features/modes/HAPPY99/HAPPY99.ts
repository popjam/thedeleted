import { EffectVariant } from "isaac-typescript-definitions";
import { getPlayerIndex, spawnEffect } from "isaacscript-common";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.HAPPY99;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const MODE_DATA = getModeData(MODE)!;

export function happy99Init(): void {
  mod.saveDataManager("happy99", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function happy99ModeSetup(player: EntityPlayer): void {
  fprint(`HAPPY99: Mode init for player: ${getPlayerIndex(player)}`);
}

/** When the player swaps out from HAPPY99 mode. */
export function happy99ModeFin(player: EntityPlayer): void {}

/** Death fireworks effect */
export function happy99PostPlayerFatalDamage(
  player: EntityPlayer,
): boolean | undefined {
  spawnEffect(EffectVariant.FIREWORKS, 0, player.Position);
  spawnEffect(EffectVariant.FIREWORKS, 0, player.Position);
  return undefined;
}
