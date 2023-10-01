import { ActiveSlot, CollectibleType } from "isaac-typescript-definitions";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import {
  isZazzinatorActive,
  isZazzinatorActiveCopy,
} from "../../../sets/zazzSets";
import {
  getCollectibleChargeType,
  getCollectibleMaxCharges,
} from "isaacscript-common";
import { getCustomActiveInSlot } from "../../../features/corruption/inversion/customActives";

/** Determines if the physical Zazz Active added to ActiveSlot.PRIMARY should be a copy or not. */
export function shouldZazzActiveBeACopy(player: EntityPlayer): boolean {
  const hasSchoolbag = player.HasCollectible(CollectibleType.SCHOOLBAG);
  const primarySlotActive = getCustomActiveInSlot(player, ActiveSlot.PRIMARY);
  const secondarySlotActive = getCustomActiveInSlot(
    player,
    ActiveSlot.SECONDARY,
  );

  if (primarySlotActive === undefined || !hasSchoolbag) {
    return false;
  }

  // From this point on, has schoolbag and activeSlot1 is defined.
  if (secondarySlotActive === undefined) {
    return !(primarySlotActive.copy ?? true);
  }

  // Both slots full.
  return !(secondarySlotActive.copy ?? true);
}

/**
 * Checks if the InvertedActiveActionSet matches the Zazzinator dummy item by comparing the charge
 * type, charges, and whether or not it is a copy.
 */
export function doesInvertedActiveActionSetMatchZazzActive(
  actionSet: InvertedActiveActionSet,
  zazzActive: CollectibleType,
): boolean {
  const chargeType = actionSet.getChargeType();
  const charges = actionSet.getCharges();
  const isCopy = actionSet.copy ?? false;

  if (!isZazzinatorActive(zazzActive)) {
    return false;
  }

  if (isZazzinatorActiveCopy(zazzActive) !== isCopy) {
    return false;
  }

  if (charges !== getCollectibleMaxCharges(zazzActive)) {
    return false;
  }

  if (chargeType !== getCollectibleChargeType(zazzActive)) {
    return false;
  }

  return true;
}

/**
 * Add the Zazzinator Active that correlates with the InvertedActiveActionSet to the desired slot.
 * Note: This shouldn't be used as it only adds a dead item to the player, use
 * 'addInvertedActionSetToPlayer()' instead.
 *
 * @param player The player to add the Zazzinator Active to.
 * @param actionSet The InvertedActiveActionSet to add.
 * @param slot The slot to add the Zazzinator Active to.
 */
export function _addZazzActiveToPlayer(
  player: EntityPlayer,
  actionSet: InvertedActiveActionSet,
  slot: ActiveSlot,
): void {
  if (slot === ActiveSlot.PRIMARY) {
    const shouldBeCopy = shouldZazzActiveBeACopy(player);
    actionSet.copy = shouldBeCopy;
    player.AddCollectible(
      actionSet.getZazzActive(actionSet),
      actionSet.getCharges(),
      undefined,
      slot,
    );
  } else if (slot === ActiveSlot.POCKET) {
    player.SetPocketActiveItem(actionSet.getZazzActive(actionSet), slot);
  }
}
