import { temporaryActionResponseInit } from "./classes/corruption/responses/TemporaryActionResponse";
import { facetInit } from "./classes/Facet";
import { corruptionGenerationInit } from "./features/corruption/corruptionGeneration";
import { activeItemTrackerInit } from "./features/corruption/effects/activeItemTracker";
import { itemEffectsInit } from "./features/corruption/effects/itemEffects";
import { pickupEffectsInit } from "./features/corruption/effects/pickupEffects";
import { playerEffectsInit } from "./features/corruption/effects/playerEffects";
import { bombInventoryInit } from "./features/corruption/inventory/bombInventory";
import { invertedItemCorruptInit } from "./features/corruption/inventory/passiveItemInventory";
import { removedItemTrackerInit } from "./features/corruption/inventory/removedInvertedItems";
import { customActivesInit } from "./features/corruption/inversion/customActives";
import { lastPickedUpInvertedCollectibleInit } from "./features/corruption/inversion/lastPickedUpInverted";
import { pickupInversionInit } from "./features/corruption/inversion/pickupInversion";
import { inversionInit } from "./features/corruption/inversion/playerInversion";
import { gameEntitySetBuilderInit } from "./features/data/gameEntitySetBuilder";
import { backdropHelperInit } from "./features/general/backdropHelper";
import { floorColorHelper } from "./features/general/floorColorHelper";
import { isLeavingGameInit } from "./features/general/isLeavingGame";
import { NPCIndexHelperInit } from "./features/general/NPCIndex";
import { playerStatsInit } from "./features/general/playerStats";
import { RNGHelperInit } from "./features/general/RNGHelper";
import { temporaryItemsInit } from "./features/general/temporaryItems";
import { happy99Init } from "./features/modes/HAPPY99/HAPPY99";
import { iLoveYouInit } from "./features/modes/ILOVEYOU/ILOVEYOU";
import { modeInit } from "./features/modes/mode";
import { mydoomInit } from "./features/modes/MYDOOM/MYDOOM";
import { zipbomberInit } from "./features/modes/ZIPBOMBER/ZIPBOMBER";
import { uiPCInit } from "./features/pc/uiPC";
import { runIndexInit } from "./features/runIndex";
import { EIDSettingsInit } from "./features/settings/ActionSetThemeSetting";
import { GeneralSettingsInit } from "./features/settings/GeneralSettings";
import { happy99SettingsInit } from "./features/settings/HAPPY99Settings";
import { moddedNPCSettingsInit } from "./features/settings/ModdedNPCSettings";
import { sophosSettingsInit } from "./features/settings/SOPHOSSettings";
import { glitchyReplacePlayerSpritesheetInit } from "./helper/deletedSpecific/glitchyPlayerTransform";

// eslint-disable-next-line isaacscript/require-capital-const-assertions, isaacscript/require-capital-read-only
export const FEATURE_INIT_FUNCTIONS: Array<() => void> = [
  uiPCInit,
  inversionInit,
  modeInit,
  happy99Init,
  iLoveYouInit,
  mydoomInit,
  pickupInversionInit,
  playerEffectsInit,
  itemEffectsInit,
  corruptionGenerationInit,
  EIDSettingsInit,
  runIndexInit,
  temporaryItemsInit,
  playerStatsInit,
  happy99SettingsInit,
  sophosSettingsInit,
  pickupEffectsInit,
  invertedItemCorruptInit,
  zipbomberInit,
  bombInventoryInit,
  temporaryActionResponseInit,
  RNGHelperInit,
  GeneralSettingsInit,
  lastPickedUpInvertedCollectibleInit,
  facetInit,
  backdropHelperInit,
  removedItemTrackerInit,
  glitchyReplacePlayerSpritesheetInit,
  floorColorHelper,
  customActivesInit,
  activeItemTrackerInit,
  moddedNPCSettingsInit,
  gameEntitySetBuilderInit,
  NPCIndexHelperInit,
  isLeavingGameInit,
];
