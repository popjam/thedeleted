import { ModCallbackCustom } from "isaacscript-common";
import type { ModUpgraded } from "isaacscript-common";
import { triggerOnSlotUseActions } from "../classes/corruption/actions/OnSlotUseAction";
import { fprint } from "../helper/printHelper";

export function postSlotAnimationChanged(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_SLOT_ANIMATION_CHANGED, main);
}

function main(
  slot: Entity,
  previousAnimation: string,
  currentAnimation: string,
) {
  fprint(`Slot animation changed: ${previousAnimation} to ${currentAnimation}`);
  triggerOnSlotUseActions(slot, previousAnimation, currentAnimation);
}
