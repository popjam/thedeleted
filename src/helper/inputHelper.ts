/** Functions to help assist player input. */

import { ActiveSlot, ButtonAction } from "isaac-typescript-definitions";

/** This will get the ButtonAction that would have been pressed for the item in the specified activeSlot to fire. */
export function activeSlotToButtonAction(activeSlot: ActiveSlot): ButtonAction {
  if (activeSlot === ActiveSlot.PRIMARY) {
    return ButtonAction.ITEM;
  } else if (activeSlot === ActiveSlot.POCKET) {
    return ButtonAction.PILL_CARD;
  }
  error("Invalid active slot: " + activeSlot);
}
