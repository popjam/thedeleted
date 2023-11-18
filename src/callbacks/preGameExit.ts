import { ModCallback } from "isaac-typescript-definitions";
import { fprint } from "../helper/printHelper";
import { facetPreGameExit } from "../classes/Facet";
import type { ModUpgraded } from "isaacscript-common";

export function preGameExitInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.PRE_GAME_EXIT, main); // 35
}

function main(shouldSave: boolean) {
  fprint(`PRE_GAME_EXIT: ${shouldSave}`);
  if (shouldSave) {
    // The run has been saved, but not ended:
    runSavedMain();
  } else {
    // The run has ended:
    runEndedMain();
  }
}

function runEndedMain() {
  facetPreGameExit();
}

function runSavedMain() {
  // TODO.
}
