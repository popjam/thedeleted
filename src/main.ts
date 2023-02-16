import { getEnumValues } from "isaacscript-common";
import { evaluateCacheInit } from "./callbacks/evaluateCache";
import { postPlayerCollectibleAddedInit } from "./callbacks/playerCollectibleAdded";
import { postPlayerCollectibleRemovedInit } from "./callbacks/playerCollectibleRemoved";
import { playerTakeDMGInit } from "./callbacks/playerTakeDMG";
import { postBombExplodedInit } from "./callbacks/postBombExploded";
import { postBombInitLateInit } from "./callbacks/postBombInitLate";
import { postEntityKillInit } from "./callbacks/postEntityKill";
import { postGameStartedReorderedInit } from "./callbacks/postGameStartedReordered";
import { postItemPickupInit } from "./callbacks/postItemPickup";
import { postNewLevelReorderedInit } from "./callbacks/postNewLevelReordered";
import { postNewRoomInit } from "./callbacks/postNewRoom";
import { postNewRoomReorderedInit } from "./callbacks/postNewRoomReordered";
import { postNPCInitLateInit } from "./callbacks/postNPCInitLate";
import { postPeffectUpdateReorderedInit } from "./callbacks/postPeffectUpdateReordered";
import { postPickupChangedInit } from "./callbacks/postPickupChanged";
import { postPickupCollectInit } from "./callbacks/postPickupCollect";
import { postPickupInitFirst } from "./callbacks/postPickupInitFirst";
import { postPickupInitLate } from "./callbacks/postPickupInitLate";
import { postPlayerChangeTypeInit } from "./callbacks/postPlayerChangeType";
import { postPlayerFatalDamageInit } from "./callbacks/postPlayerFatalDamage";
import { postPlayerInitInit } from "./callbacks/postPlayerInit";
import { postPlayerInitFirstInit } from "./callbacks/postPlayerInitFirst";
import { postRenderInit } from "./callbacks/postRender";
import { postUpdateInit } from "./callbacks/postUpdate";
import { postUseItemInit } from "./callbacks/postUseItem";
import { preGameExitInit } from "./callbacks/preGameExit";
import { preGetPedestalInit } from "./callbacks/preGetPedestal";
import { preItemPickupInit } from "./callbacks/preItemPickup";
import { preNewLevelReorderedInit } from "./callbacks/preNewLevel";
import { prePickupCollisionInit } from "./callbacks/prePickupCollision";
import { OnDamageAction } from "./classes/corruption/actions/OnDamageAction";
import { OnFloorAction } from "./classes/corruption/actions/OnFloorAction";
import { OnKillAction } from "./classes/corruption/actions/OnKillAction";
import { OnObtainAction } from "./classes/corruption/actions/OnObtainAction";
import { OnRoomAction } from "./classes/corruption/actions/OnRoomAction";
import { InvertedActiveActionSet } from "./classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { InvertedPassiveActionSet } from "./classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { NonInvertedPickupActionSet } from "./classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { RemoveActionResponse } from "./classes/corruption/responses/RemoveActionResponse";
import { RemoveCollectibleResponse } from "./classes/corruption/responses/RemoveCollectibleResponse";
import { RemoveRuleResponse } from "./classes/corruption/responses/RemoveRuleResponse";
import { SpawnNPCResponse } from "./classes/corruption/responses/SpawnNPCResponse";
import { SpawnPickupResponse } from "./classes/corruption/responses/SpawnPickupResponse";
import {
  TemporaryActionResponse,
  temporaryActionResponseInit,
} from "./classes/corruption/responses/TemporaryActionResponse";
import { TemporaryCollectibleResponse } from "./classes/corruption/responses/TemporaryCollectibleResponse";
import { TemporaryRuleResponse } from "./classes/corruption/responses/TemporaryRuleResponse";
import { TriggerInSequenceResponse } from "./classes/corruption/responses/TriggerInSequence";
import { TriggerOverTimeResponse } from "./classes/corruption/responses/TriggerOverTimeResponse";
import { TriggerRandomResponse } from "./classes/corruption/responses/TriggerRandomResponse";
import { UseActiveItemResponse } from "./classes/corruption/responses/UseActiveItemResponse";
import { WaitThenTriggerResponse } from "./classes/corruption/responses/WaitThenTriggerResponse";
import { facetInit } from "./classes/Facet";
import { initCorruptedCollectibleSpriteFacet } from "./classes/facets/CorruptedCollectibleSpriteFacet";
import { initExampleFacet } from "./classes/facets/ExampleFacet";
import { initPCFacet } from "./classes/facets/pc/PCFacet";
import { initRenderOverHeadFacet } from "./classes/facets/RenderOverHeadFacet";
import { Mode } from "./enums/modes/Mode";
import { initEID } from "./features/compatibility/EID/EIDInit";
import { addTestingCommands } from "./features/console/testing";
import { corruptionGenerationInit } from "./features/corruption/corruptionGeneration";
import { itemEffectsInit } from "./features/corruption/effects/itemEffects";
import { pickupEffectsInit } from "./features/corruption/effects/pickupEffects";
import { playerEffectsInit } from "./features/corruption/effects/playerEffects";
import { bombInventoryInit } from "./features/corruption/inventory/bombInventory";
import { invertedItemCorruptInit } from "./features/corruption/inventory/itemInventory";
import { lastPickedUpInvertedCollectibleInit } from "./features/corruption/inversion/lastPickedUpInverted";
import { pickupInversionInit } from "./features/corruption/inversion/pickupInversion";
import { inversionInit } from "./features/corruption/inversion/playerInversion";
import { backdropInit } from "./features/general/backdropHelper";
import { playerStatsInit } from "./features/general/playerStats";
import { RNGHelperInit } from "./features/general/RNGHelper";
import { temporaryItemsInit } from "./features/general/temporaryItems";
import { happy99Init } from "./features/modes/HAPPY99/HAPPY99";
import { iLoveYouInit } from "./features/modes/ILOVEYOU/ILOVEYOU";
import { modeInit } from "./features/modes/mode";
import { zipbomberInit } from "./features/modes/ZIPBOMBER/ZIPBOMBER";
import { uiPCInit } from "./features/pc/uiPC";
import { runIndexInit } from "./features/runIndex";
import { EIDSettingsInit } from "./features/settings/EIDSettings";
import { GeneralSettingsInit } from "./features/settings/GeneralSettings";
import { happy99SettingsInit } from "./features/settings/HAPPY99Settings";
import { sophosSettingsInit } from "./features/settings/SOPHOSSettings";
import { getModePlayerType, MODE_DATA_MAP } from "./maps/modes/modeMap";
import { mod } from "./mod";

const IS_DEV = true;

main();

function main() {
  initCallbacks();
  initStats();
  initClasses();
  initFeatures();
  initExternalMods();
  initExports();
  initFacets();
}

/** Initialize mod features. */
function initFeatures() {
  if (IS_DEV) {
    devInit();
  }
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
  pickupEffectsInit();
  invertedItemCorruptInit();
  zipbomberInit();
  bombInventoryInit();
  temporaryActionResponseInit();
  RNGHelperInit();
  GeneralSettingsInit();
  lastPickedUpInvertedCollectibleInit();
  facetInit();
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
  postPickupCollectInit(mod);
  postPlayerCollectibleAddedInit(mod);
  postPlayerCollectibleRemovedInit(mod);
  postEntityKillInit(mod);
  prePickupCollisionInit(mod);
  postBombExplodedInit(mod);
  postBombInitLateInit(mod);
  preItemPickupInit(mod);
  preGameExitInit(mod);
  postPickupChangedInit(mod);
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
    const characterStats = MODE_DATA_MAP.get(mode);
    if (characterStats?.characterStats !== undefined) {
      mod.registerCharacterStats(
        getModePlayerType(mode),
        characterStats.characterStats,
      );
    }
  }
}

function initClasses() {
  mod.saveDataManagerRegisterClass(
    InvertedPassiveActionSet,
    InvertedActiveActionSet,
    NonInvertedPickupActionSet,
    OnDamageAction,
    OnFloorAction,
    OnObtainAction,
    OnRoomAction,
    OnKillAction,
    UseActiveItemResponse,
    WaitThenTriggerResponse,
    TriggerRandomResponse,
    TriggerOverTimeResponse,
    TriggerInSequenceResponse,
    TemporaryCollectibleResponse,
    TemporaryRuleResponse,
    TemporaryActionResponse,
    RemoveCollectibleResponse,
    RemoveRuleResponse,
    RemoveActionResponse,
    SpawnNPCResponse,
    SpawnPickupResponse,
  );
}

function initFacets() {
  initExampleFacet();
  initCorruptedCollectibleSpriteFacet();
  initRenderOverHeadFacet();
  initPCFacet();
}
