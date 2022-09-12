import {
  addConsoleCommand,
  enableExtraConsoleCommands,
  enableFastReset,
  ModUpgraded,
  removeFadeIn,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
  upgradeMod,
} from "isaacscript-common";
import { postNewRoomInit } from "./callbacks/postNewRoom";
import { postPeffectUpdateInit } from "./callbacks/postPeffectUpdate";
import { postPickupInitLate } from "./callbacks/postPickupInitLate";
import { postPlayerInitFirstInit } from "./callbacks/postPlayerInitFirst";
import { postRenderInit } from "./callbacks/postRender";
import { postUpdateInit } from "./callbacks/postUpdate";
import { postUseItemInit } from "./callbacks/postUseItem";
import { preGetPedestalCollectibleInit } from "./callbacks/preGetPedestalCollectible";
import { postItemPickupInit } from "./callbacks/preItemPickup";
import { testingFunctionA, testingFunctionB } from "./features/console/testing";
import { itemEffectsInit } from "./features/corruption/effects/itemEffects";
import { playerEffectsInit } from "./features/corruption/effects/playerEffects";
import { pickupInversionInit } from "./features/corruption/inversion/pickupInversion";
import { inversionInit } from "./features/corruption/inversion/playerInversion";
import { happy99Init } from "./features/modes/HAPPY99/HAPPY99";
import { modeInit } from "./features/modes/mode";
import { mainPCInit } from "./features/pc/mainPC";
import { uiPCInit } from "./features/pc/uiPC";
import { backdropInit } from "./helper/backdropHelper";

const MOD_NAME = "thedeleted";
const IS_DEV = true;

main();

function main() {
  // Instantiate a new mod object, which grants the ability to add callback functions that
  // correspond to in-game events.
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);
  init(mod);
}

/** Initialize mod features. */
function init(mod: ModUpgraded) {
  if (IS_DEV) {
    devInit(mod);
  }
  mainPCInit();
  uiPCInit();
  backdropInit();
  inversionInit();
  modeInit();
  registerCallbacks(mod);
  happy99Init();
  pickupInversionInit();
  playerEffectsInit();
  itemEffectsInit();
  corruptionDNASetting();
}

/** Initialize mod features for dev. */
function devInit(mod: ModUpgraded) {
  saveDataManagerSetGlobal();
  setLogFunctionsGlobal();
  enableExtraConsoleCommands(mod);
  enableFastReset();
  removeFadeIn();
  addConsoleCommand("del", () => {
    testingFunctionA();
  });
  addConsoleCommand("eted", () => {
    testingFunctionB();
  });
}

/** Register all the callbacks. */
function registerCallbacks(mod: ModUpgraded) {
  postUpdateInit(mod);
  postRenderInit(mod);
  postPeffectUpdateInit(mod);
  postNewRoomInit(mod);
  postUseItemInit(mod);
  postPlayerInitFirstInit(mod);
  postPickupInitLate(mod);
  postItemPickupInit(mod);
  preGetPedestalCollectibleInit(mod);
}
function corruptionDNASetting() {
  throw new Error("Function not implemented.");
}
