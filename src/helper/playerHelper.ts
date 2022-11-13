import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import {
  arrayToBitFlags,
  getPlayerBlackHearts,
  getPlayerSoulHearts,
} from "isaacscript-common";

/** Sets the players' bomb count to a specific amount. */
export function setPlayerBombs(player: EntityPlayer, amount: number): void {
  player.AddBombs(amount - player.GetNumBombs());
}

/** Sets the players' key count to a specific amount. */
export function setPlayerKeys(player: EntityPlayer, amount: number): void {
  player.AddKeys(amount - player.GetNumKeys());
}

/** Sets the players' coin count to a specific amount. */
export function setPlayerCoins(player: EntityPlayer, amount: number): void {
  player.AddCoins(amount - player.GetNumBombs());
}

/**
 * Sets heart containers the player has to a specific amount. These heart containers will be empty.
 * One unit is half a heart container.
 */
export function setPlayerHeartContainers(
  player: EntityPlayer,
  amount: number,
): void {
  player.AddMaxHearts(amount - player.GetMaxHearts(), true);
}

/** Sets the amount of red hearts the player has. One unit equals half a red heart. */
export function setPlayerRedHearts(player: EntityPlayer, amount: number): void {
  player.AddHearts(amount - player.GetHearts());
}

/** Sets the amount of rotten hearts the player has. One unit equals half a red heart. */
export function setPlayerRottenHearts(
  player: EntityPlayer,
  amount: number,
): void {
  player.AddRottenHearts(amount - player.GetRottenHearts());
}

/** Sets the amount of soul hearts the player has. One unit equals half a soul heart. */
export function setPlayerSoulHearts(
  player: EntityPlayer,
  amount: number,
): void {
  player.AddSoulHearts(amount - getPlayerSoulHearts(player));
}

/** Sets the amount of black hearts the player has. One unit equals half a black heart. */
export function setPlayerBlackHearts(
  player: EntityPlayer,
  amount: number,
): void {
  player.AddBlackHearts(amount - getPlayerBlackHearts(player));
}

/**
 * Sets the amount of bone hearts the player has. One unit equals one bone heart. They will be
 * empty.
 */
export function setPlayerBoneHearts(
  player: EntityPlayer,
  amount: number,
): void {
  player.AddBoneHearts(amount - player.GetBoneHearts());
}

/** Sets the amount of broken hearts the player has. One unit equals one broken heart. */
export function setPlayerBrokenHearts(
  player: EntityPlayer,
  amount: number,
): void {
  player.AddBrokenHearts(amount - player.GetBrokenHearts());
}

/** Sets the amount of golden hearts the player has. One unit equals one golden heart. */
export function setPlayerGoldenHearts(
  player: EntityPlayer,
  amount: number,
): void {
  player.AddGoldenHearts(amount - player.GetGoldenHearts());
}

/** Sets the amount of eternal hearts the player has. One unit equals one eternal heart. */
export function setPlayerEternalHearts(
  player: EntityPlayer,
  amount: number,
): void {
  player.AddEternalHearts(amount - player.GetEternalHearts());
}

/** Replace player "001.000_player.anm2" animation. */
export function replacePlayerAnm2(
  player: EntityPlayer,
  anm2Path: string,
): void {
  const sprite = player.GetSprite();
  sprite.Load(anm2Path, true);
}

/** Quickly teleports a player to a location and uses the active item. */
export function useActiveItemAtPosition(
  activeItem: CollectibleType,
  roomPos: Vector,
  player?: EntityPlayer,
): void {
  player = player ?? Isaac.GetPlayer();
  const currentPos = player.Position;
  player.Position = roomPos;
  player.UseActiveItem(
    activeItem,
    arrayToBitFlags<UseFlag>([
      UseFlag.NO_ANIMATION,
      UseFlag.NO_ANNOUNCER_VOICE,
    ]),
  );
  player.Position = currentPos;
}
