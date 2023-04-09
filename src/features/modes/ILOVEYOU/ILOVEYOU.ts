import {
  CollectibleType,
  DamageFlag,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  getPlayerIndex,
  getPlayersOfType,
  sfxManager,
} from "isaacscript-common";
import { PlayerTypeCustom } from "../../../enums/general/PlayerTypeCustom";
import { SoundEffectCustom } from "../../../enums/general/SoundEffectCustom";
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

export function iloveyouPlayerCollision(
  player: EntityPlayer,
  collider: Entity,
): boolean | undefined {
  sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 1);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 2);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 3);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 4);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 5);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 6);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 7);
  return undefined;
}

export function iloveyouPlayerTakeDMG(
  player: EntityPlayer,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  sfxManager.Play(SoundEffect.KISS_LIPS);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 1);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 2);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 3);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 4);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 5);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 6);
  mod.runInNRenderFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
  }, 7);
  return undefined;
}

/** Death kiss effect */
// TODO: Make it audible.
export function iloveyouPostPlayerFatalDamage(
  player: EntityPlayer,
): boolean | undefined {
  mod.runInNGameFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_DIES);
    sfxManager.Play(SoundEffectCustom.KISS);
  }, 5);
  mod.runInNGameFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_DIES);
  }, 6);
  mod.runInNGameFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_DIES);
  }, 7);
  mod.runInNGameFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_DIES);
  }, 8);
  mod.runInNGameFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_DIES);
  }, 9);
  mod.runInNGameFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_DIES);
  }, 10);
  mod.runInNGameFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_DIES);
  }, 11);
  mod.runInNGameFrames(() => {
    sfxManager.Stop(SoundEffect.ISAAC_DIES);
  }, 12);
  return undefined;
}
