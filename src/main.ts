import { getEnumValues } from "isaacscript-common";
import { evaluateCacheInit } from "./callbacks/evaluateCache";
import { postPlayerCollectibleAddedInit } from "./callbacks/playerCollectibleAdded";
import { postPlayerCollectibleRemovedInit } from "./callbacks/playerCollectibleRemoved";
import { playerTakeDMGInit } from "./callbacks/playerTakeDMG";
import { postBombExplodedInit } from "./callbacks/postBombExploded";
import { postBombInitLateInit } from "./callbacks/postBombInitLate";
import { postEntityKillInit } from "./callbacks/postEntityKill";
import { postFireTearInit } from "./callbacks/postFireTear";
import { postGameStartedReorderedInit } from "./callbacks/postGameStartedReordered";
import { postItemPickupInit } from "./callbacks/postItemPickup";
import { postNPCInitLateInit } from "./callbacks/postNPCInitLate";
import { postNewLevelReorderedInit } from "./callbacks/postNewLevelReordered";
import { postNewRoomInit } from "./callbacks/postNewRoom";
import { postNewRoomReorderedInit } from "./callbacks/postNewRoomReordered";
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
import { prePlayerCollisionInit } from "./callbacks/prePlayerCollision";
import { preSpawnClearAwardInit } from "./callbacks/preSpawnClearAward";
import { initCorruptedCollectibleSpriteFacet } from "./classes/facets/CorruptedCollectibleSpriteFacet";
import { initCustomActiveFacet } from "./classes/facets/CustomActiveFacet";
import { initExampleFacet } from "./classes/facets/ExampleFacet";
import { initRenderOverHeadFacet } from "./classes/facets/RenderOverHeadFacet";
import { initBolsterNPCFacet } from "./classes/facets/entityModifiers.ts/NPCModifiers/BolsterNPCFacet";
import { initFreezeNPCFacet } from "./classes/facets/entityModifiers.ts/NPCModifiers/FreezeNPCFacet";
import { initHybridNPCFacet } from "./classes/facets/entityModifiers.ts/NPCModifiers/HybridNPCFacet";
import { initNonMandatoryNPCFacet } from "./classes/facets/entityModifiers.ts/NPCModifiers/NonMandatoryNPCFacet";
import { initUnstableEntityFacet } from "./classes/facets/entityModifiers.ts/UnstableEntityFacet";
import { initEveryItemIsFacet } from "./classes/facets/entityModifiers.ts/pickupModifiers/EveryItemIsFacet";
import { initPCFacet } from "./classes/facets/pc/PCFacet";
import { Mode } from "./enums/modes/Mode";
import { FEATURE_INIT_FUNCTIONS } from "./features";
import { initEID } from "./features/compatibility/EID/EIDInit";
import { addTestingCommands } from "./features/console/testing";
import { fprint } from "./helper/printHelper";
import { MODE_DATA_MAP, getModePlayerType } from "./maps/modes/modeMap";
import { mod } from "./mod";
import { initHideNPCFacet } from "./classes/facets/entityModifiers.ts/NPCModifiers/HideNPCFacet";
import { initSpawnEntityByNameFacet } from "./classes/facets/SpawnEntityByNameFacet";
import { postEntityRemoveInit } from "./callbacks/postEntityRemove";
import { postNPCUpdateInit } from "./callbacks/postNPCUpdate";
import { initPermanentNPCStatusEffectFacet } from "./classes/facets/entityModifiers.ts/NPCModifiers/PermanentNPCStatusEffectFacet";
import { preCustomReviveInit } from "./callbacks/preCustomRevive";
import { postUsePillInit } from "./callbacks/postUsePill";
import { postPlayerStatChangedInit } from "./callbacks/postPlayerChangeStat";
import { postUseCardInit } from "./callbacks/postUseCard";
import { postGreedWaveClearInit } from "./callbacks/postGreedWaveClear";
import { postPurchaseInit } from "./callbacks/postPurchase";
import { initClasses } from "./classes";
import { postRoomClearInit } from "./callbacks/postRoomClear";
import { postSacrificeInit } from "./callbacks/postSacrifice";
import { postSlotUseInit } from "./callbacks/postSlotUse";

const IS_DEV = true;

fprint("Loading 'main.ts'...");
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (IS_DEV) {
    devInit();
  }

  for (const initFunction of FEATURE_INIT_FUNCTIONS) {
    initFunction();
  }
}

/** Initialize mod features for dev. */
function devInit() {
  fprint("Initializing dev features...");
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
  prePlayerCollisionInit(mod);
  preSpawnClearAwardInit(mod);
  postFireTearInit(mod);
  preNewLevelReorderedInit(mod);
  postEntityRemoveInit(mod);
  postNPCUpdateInit(mod);
  preCustomReviveInit(mod);
  postUsePillInit(mod);
  postPlayerStatChangedInit(mod);
  postUseCardInit(mod);
  postGreedWaveClearInit(mod);
  postPurchaseInit(mod);
  postRoomClearInit(mod);
  postSacrificeInit(mod);
  postSlotUseInit(mod);
}

/** Initialize External mods if they exist. */
function initExternalMods() {
  initEID();
}

function initExports() {
  // eslint-disable-next-line no-implicit-globals
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

function initFacets() {
  initExampleFacet();
  initCorruptedCollectibleSpriteFacet();
  initRenderOverHeadFacet();
  initPCFacet();
  initUnstableEntityFacet();
  initHybridNPCFacet();
  initFreezeNPCFacet();
  initBolsterNPCFacet();
  initEveryItemIsFacet();
  initCustomActiveFacet();
  initNonMandatoryNPCFacet();
  initHideNPCFacet();
  initSpawnEntityByNameFacet();
  initPermanentNPCStatusEffectFacet();
}
