import { CallbackPriority, ModCallback } from "isaac-typescript-definitions";
import { fprint } from "../helper/printHelper";
import { facetPreGameExit } from "../classes/Facet";
import { PriorityCallback } from "isaacscript-common";
import type { ModUpgraded } from "isaacscript-common";
import { isLeavingGamePreGameExitEarly } from "../features/general/isLeavingGame";

export function preGameExitInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.PRE_GAME_EXIT, main); // 35
  mod.AddPriorityCallback(
    ModCallback.PRE_GAME_EXIT,
    CallbackPriority.EARLY,
    mainEarly,
  ); // 35
}

function mainEarly(shouldSave: boolean) {
  isLeavingGamePreGameExitEarly(shouldSave);
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

function runSavedMain() {}
