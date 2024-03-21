import { ModCallback, RoomType } from "isaac-typescript-definitions";
import type { PillEffect, UseFlag } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { triggerOnPillUseActions } from "../classes/corruption/actions/OnPillUseAction";

export function postUsePillInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_USE_PILL, main);
}

function main(
  pillEffect: PillEffect,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
) {
  triggerOnPillUseActions(pillEffect, player, useFlags);
}
