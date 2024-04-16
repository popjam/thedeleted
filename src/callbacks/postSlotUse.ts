import {
  DefaultMap,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
} from "isaacscript-common";
import type { ModUpgraded } from "isaacscript-common";
import { fprint } from "../helper/printHelper";

const slotAnimationStates = new DefaultMap<PtrHash, [string, number]>(() => [
  "",
  0,
]);

export function postSlotUseInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_SLOT_COLLISION,
    postSlotCollisionAnimationChanged,
  );
}

function postSlotCollisionAnimationChanged(slot: EntitySlot, entity: Entity) {
  // Entity is always a player.
  const player = entity.ToPlayer();
  if (player === undefined) {
    return;
  }

  const slotPtrHash = GetPtrHash(slot);
  const [previousAnimation, cooldownFrames] =
    slotAnimationStates.getAndSetDefault(slotPtrHash);

  // Decrement cooldown if it's active.
  if (cooldownFrames > 0) {
    slotAnimationStates.set(slotPtrHash, [
      previousAnimation,
      cooldownFrames - 1,
    ]);
    return;
  }

  // Check if animation has changed and cooldown is not active.
  const currentAnimation = slot.GetSprite().GetAnimation();
  if (previousAnimation !== currentAnimation && currentAnimation !== "") {
    // Your logic here
    fprint(
      `Slot animation changed: ${previousAnimation} to ${currentAnimation}`,
    );

    main(player, slot, currentAnimation, slotPtrHash);

    // Set cooldown and store previous animation.
    slotAnimationStates.set(slotPtrHash, [
      currentAnimation,
      GAME_FRAMES_PER_SECOND, // 1 second cooldown
    ]);
  }
}

function main(
  player: EntityPlayer,
  _slot: EntitySlot,
  _currentAnimation: string,
  _slotPtrHash: PtrHash,
) {}
