import { getEnumValues } from "isaacscript-common";
import { evaluateCacheInit } from "./callbacks/evaluateCache";
import { playerTakeDMGInit } from "./callbacks/playerTakeDMG";
import { postGameStartedReorderedInit } from "./callbacks/postGameStartedReordered";
import { postNewLevelReorderedInit } from "./callbacks/postNewLevelReordered";
import { postNewRoomInit } from "./callbacks/postNewRoom";
import { postNewRoomReorderedInit } from "./callbacks/postNewRoomReordered";
import { postNPCInitLateInit } from "./callbacks/postNPCInitLate";
import { postPeffectUpdateReorderedInit } from "./callbacks/postPeffectUpdateReordered";
import { postPickupInitFirst } from "./callbacks/postPickupInitFirst";
import { postPickupInitLate } from "./callbacks/postPickupInitLate";
import { postPlayerChangeTypeInit } from "./callbacks/postPlayerChangeType";
import { postPlayerFatalDamageInit } from "./callbacks/postPlayerFatalDamage";
import { postPlayerInitInit } from "./callbacks/postPlayerInit";
import { postPlayerInitFirstInit } from "./callbacks/postPlayerInitFirst";
import { postRenderInit } from "./callbacks/postRender";
import { postUpdateInit } from "./callbacks/postUpdate";
import { postUseItemInit } from "./callbacks/postUseItem";
import { preGetPedestalInit } from "./callbacks/preGetPedestal";
import { postItemPickupInit } from "./callbacks/preItemPickup";
import { preNewLevelReorderedInit } from "./callbacks/preNewLevel";
import { Mode } from "./enums/modes/Mode";
import { initEID } from "./features/compatibility/EID/EIDInit";
import { addTestingCommands } from "./features/console/testing";
import { corruptionGenerationInit } from "./features/corruption/corruptionGeneration";
import { itemEffectsInit } from "./features/corruption/effects/itemEffects";
import { playerEffectsInit } from "./features/corruption/effects/playerEffects";
import { pickupInversionInit } from "./features/corruption/inversion/pickupInversion";
import { inversionInit } from "./features/corruption/inversion/playerInversion";
import { playerStatsInit } from "./features/general/playerStats";
import { temporaryItemsInit } from "./features/general/temporaryItems";
import { happy99Init } from "./features/modes/HAPPY99/HAPPY99";
import { iLoveYouInit } from "./features/modes/ILOVEYOU/ILOVEYOU";
import { modeInit } from "./features/modes/mode";
import { mainPCInit } from "./features/pc/mainPC";
import { uiPCInit } from "./features/pc/uiPC";
import { runIndexInit } from "./features/runIndex";
import { EIDSettingsInit } from "./features/settings/EIDSettings";
import { happy99SettingsInit } from "./features/settings/HAPPY99Settings";
import { sophosSettingsInit } from "./features/settings/SOPHOSSettings";
import { backdropInit } from "./helper/backdropHelper";
import { getModeData, getModePlayerType } from "./maps/modes/modeMap";
import { mod } from "./mod";

const IS_DEV = true;

main();

function main() {
  initFeatures();
  initCallbacks();
  initExternalMods();
  initExports();
  initStats();
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
  runIndexInit();
  temporaryItemsInit();
  playerStatsInit();
  happy99SettingsInit();
  sophosSettingsInit();
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
  postGameStartedReorderedInit(mod);
  postNewLevelReorderedInit(mod);
  preNewLevelReorderedInit(mod);
  playerTakeDMGInit(mod);
  postPlayerFatalDamageInit(mod);
  evaluateCacheInit(mod);
  postPickupInitFirst(mod);
}

/** Initialize External mods if they exist. */
function initExternalMods() {
  initEID();
}

function initExports() {
  TheDeleted = {};
}

function initStats() {
  const modes = getEnumValues(Mode);
  for (const mode of modes) {
    const { characterStats } = getModeData(mode);
    if (characterStats !== undefined) {
      mod.registerCharacterStats(getModePlayerType(mode), characterStats);
    }
  }
}
