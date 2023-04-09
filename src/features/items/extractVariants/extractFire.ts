import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import {
  getClosestEntityTo,
  getNPCs,
  getPickups,
  isPickup,
} from "isaacscript-common";
import { extractPickup } from "../../../helper/deletedSpecific/items/extractHelper";
import { fprint } from "../../../helper/printHelper";

// POST_USE_ITEM
export function extractFirePostUseItem(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: int,
  _customVarData: int,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  /** Extract targets the closest pickup. */
  const closestPickup = getClosestEntityTo(player, [
    ...getPickups(),
    ...getNPCs(),
  ]);
  if (closestPickup === undefined) {
    fprint("Nothing to extract_fire.");
    return;
  }

  if (isPickup(closestPickup)) {
    extractPickup(closestPickup);
  } else {
  }
  return undefined;
}
