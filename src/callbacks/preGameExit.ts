import { ModCallback } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { fprint } from "../helper/printHelper";

export function preGameExitInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.PRE_GAME_EXIT, main); // 35
}

function main(shouldSave: boolean) {
  fprint(`PRE_GAME_EXIT: ${shouldSave}`);
  if (!shouldSave) {
    // The run has ended:
    runEndedMain();
  } else {
    // The run has been saved, but not ended:
    runSavedMain();
  }
}

function runEndedMain() {}

function runSavedMain() {}
