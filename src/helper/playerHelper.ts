import type { UseFlag } from "isaac-typescript-definitions";
import {
  ActiveSlot,
  CardType,
  PillColor,
  PocketItemSlot,
  CollectibleType,
} from "isaac-typescript-definitions";
import type { EntityID } from "isaacscript-common";
import {
  arrayToBitFlags,
  getActivePocketItemSlot,
  getEnumValues,
  getPlayerAvailableHeartSlots,
  getPlayerBlackHearts,
  getPlayerMaxHeartContainers,
  getPlayerSoulHearts,
} from "isaacscript-common";
import { USE_ACTIVE_ITEM_RESPONSE_BITFLAG_ARRAY } from "../constants/corruptionConstants";

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

/** Replace player "001.000_player.anm2" file. */
export function replacePlayerAnm2(
  player: EntityPlayer,
  anm2Path: string,
): void {
  const sprite = player.GetSprite();
  sprite.Load(anm2Path, true);
}

/** Quickly teleports a player to a location and uses the active item, then teleports them back. */
export function useActiveItemAtPosition(
  activeItem: CollectibleType,
  roomPos: Vector,
  player?: EntityPlayer,
): void {
  player ??= Isaac.GetPlayer();
  const currentPos = player.Position;
  player.Position = roomPos;
  player.UseActiveItem(
    activeItem,
    arrayToBitFlags<UseFlag>(USE_ACTIVE_ITEM_RESPONSE_BITFLAG_ARRAY),
  );
  player.Position = currentPos;
}

/** Checks if the player is currently playing an animation. Can provide more than one. */
export function isPlayerPlayingAnimation(
  player: EntityPlayer,
  ...animation: string[]
): boolean {
  const sprite = player.GetSprite();
  const playerAnimation = sprite.GetAnimation();
  if (animation.includes(playerAnimation)) {
    return true;
  }

  return false;
}

/**
 * Get the players' total health in half hearts. This counts all types of hearts the player has,
 * including broken hearts.
 *
 * @example If the player has 2 red hearts, 1 soul heart, and 1 black heart, this will return 8.
 */
export function getPlayerTotalHealth(player: EntityPlayer): number {
  return (
    player.GetEffectiveMaxHearts() +
    player.GetSoulHearts() +
    player.GetBrokenHearts() * 2
  );
}

/**
 * Returns true if the player is holding a pill in any slot.
 *
 * @param player The player to check.
 * @param pillColor If set, will only return true if the player is holding a pill of this color.
 */
export function isPlayerHoldingPill(
  player: EntityPlayer,
  pillColor: PillColor = PillColor.NULL,
): boolean {
  return getEnumValues(PocketItemSlot).some((slot) => {
    const pill = player.GetPill(slot);
    return (
      pill !== PillColor.NULL &&
      (pillColor === PillColor.NULL || pill === pillColor)
    );
  });
}

/**
 * Returns true if the player is holding a card in any slot.
 *
 * @param player The player to check.
 * @param cardType If set, will only return true if the player is holding a card of this type.
 */
export function isPlayerHoldingCard(
  player: EntityPlayer,
  cardType: CardType = CardType.NULL,
): boolean {
  return getEnumValues(PocketItemSlot).some((slot) => {
    const card = player.GetCard(slot);
    return (
      card !== CardType.NULL &&
      (cardType === CardType.NULL || card === cardType)
    );
  });
}

/** Returns true if the player has any active item in any slot (including the pocket slot). */
export function doesPlayerHaveAnyActiveItem(player: EntityPlayer): boolean {
  return getEnumValues(ActiveSlot).some(
    (slot) => player.GetActiveItem(slot) !== CollectibleType.NULL,
  );
}
