import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { triggerOnGreedWaveClearActions } from "../classes/corruption/actions/OnGreedWaveClearAction";

// Add new callback for every use case, unless order is needed.
export function postGreedWaveClearInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_GREED_MODE_WAVE, main);
}

function main(_oldWave: int, _newWave: int) {
  triggerOnGreedWaveClearActions();
}
