import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  getPlayerIndex,
  getPlayersOfType,
  sfxManager,
} from "isaacscript-common";
import { PlayerTypeCustom } from "../../../enums/general/PlayerTypeCustom";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.ILOVEYOU;
const MODE_DATA = getModeData(MODE);

const PERSISTENT_COLLECTIBLE_EFFECT = CollectibleType.MOMS_EYESHADOW;

export function iLoveYouInit(): void {
  mod.saveDataManager("iLoveYou", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function iLoveYouModeSetup(player: EntityPlayer): void {
  fprint(`ILOVEYOU: Mode init for player: ${getPlayerIndex(player)}`);
  player
    .GetEffects()
    .AddCollectibleEffect(PERSISTENT_COLLECTIBLE_EFFECT, false);
}

/** When the player swaps out from ILOVEYOU mode. */
export function iLoveYouModeFin(player: EntityPlayer): void {
  player.GetEffects().RemoveCollectibleEffect(PERSISTENT_COLLECTIBLE_EFFECT);
}

/** Make sure ILOVEYOU player keeps collectible effect. */
// TODO: Fix
export function iLoveYouPostNewRoom(): void {
  const iLoveYouPlayers = getPlayersOfType(PlayerTypeCustom.DELETED_ILOVEYOU);
  iLoveYouPlayers.forEach((player) => {
    player
      .GetEffects()
      .AddCollectibleEffect(PERSISTENT_COLLECTIBLE_EFFECT, false);
  });
}

/** Death kiss effect */
// TODO: Make it audible.
export function iloveyouPostPlayerFatalDamage(
  player: EntityPlayer,
): boolean | undefined {
  sfxManager.Play(SoundEffect.KISS_LIPS);
  return undefined;
}
