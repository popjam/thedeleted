import { postNewRoomInit } from "./callbacks/postNewRoom";
import { postNewRoomReorderedInit } from "./callbacks/postNewRoomReordered";
import { postNPCInitLateInit } from "./callbacks/postNPCInitLate";
import { postPeffectUpdateReorderedInit } from "./callbacks/postPeffectUpdateReordered";
import { postPickupInitLate } from "./callbacks/postPickupInitLate";
import { postPlayerChangeTypeInit } from "./callbacks/postPlayerChangeType";
import { postPlayerInitInit } from "./callbacks/postPlayerInit";
import { postPlayerInitFirstInit } from "./callbacks/postPlayerInitFirst";
import { postRenderInit } from "./callbacks/postRender";
import { postUpdateInit } from "./callbacks/postUpdate";
import { postUseItemInit } from "./callbacks/postUseItem";
import { preGetPedestalInit } from "./callbacks/preGetPedestal";
import { postItemPickupInit } from "./callbacks/preItemPickup";
import { addTestingCommands } from "./features/console/testing";
import { corruptionGenerationInit } from "./features/corruption/corruptionGeneration";
import { itemEffectsInit } from "./features/corruption/effects/itemEffects";
import { playerEffectsInit } from "./features/corruption/effects/playerEffects";
import { pickupInversionInit } from "./features/corruption/inversion/pickupInversion";
import { inversionInit } from "./features/corruption/inversion/playerInversion";
import { happy99Init } from "./features/modes/HAPPY99/HAPPY99";
import { iLoveYouInit } from "./features/modes/ILOVEYOU/ILOVEYOU";
import { modeInit } from "./features/modes/mode";
import { mainPCInit } from "./features/pc/mainPC";
import { uiPCInit } from "./features/pc/uiPC";
import { EIDSettingsInit } from "./features/settings/EIDSettings";
import { backdropInit } from "./helper/backdropHelper";
import { mod } from "./mod";

const IS_DEV = true;

main();

function main() {
  initFeatures();
  initCallbacks();
}

/** Initialize mod features. */
function initFeatures() {
  if (IS_DEV) {
    devInit();
  }
  mainPCInit();
  uiPCInit();
  backdropInit();
  inversionInit();
  modeInit();
  happy99Init();
  iLoveYouInit();
  pickupInversionInit();
  playerEffectsInit();
  itemEffectsInit();
  corruptionGenerationInit();
  EIDSettingsInit();
}

/** Initialize mod features for dev. */
function devInit() {
  addTestingCommands();
  mod.enableFastReset();
}

/** Register all the callbacks. */
function initCallbacks() {
  postUpdateInit(mod);
  postRenderInit(mod);
  postPeffectUpdateReorderedInit(mod);
  postNewRoomInit(mod);
  postUseItemInit(mod);
  postPlayerInitFirstInit(mod);
  postPickupInitLate(mod);
  postItemPickupInit(mod);
  postNewRoomReorderedInit(mod);
  preGetPedestalInit(mod);
  postPlayerInitInit(mod);
  postPlayerChangeTypeInit(mod);
  postNPCInitLateInit(mod);
}
