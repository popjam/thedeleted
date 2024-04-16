import type { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { invertPlayer } from "../../helper/deletedSpecific/inversion/playerInversion";

export function bitflipPostUseItem(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: int,
  _customVarData: int,
): boolean {
  return bitFlipUse(player);
}

/**
 * On bitflip, invert the players' inversion status. Additionally, change inversion status of all
 * pre-existing items on the floor to that of the players' new inversion status.
 */
function bitFlipUse(player: EntityPlayer): boolean {
  invertPlayer(player);
  return false;
}
