import { ISCFeature, upgradeMod } from "isaacscript-common";
import { MOD_NAME } from "./constants/mod/modConstants";

const modVanilla = RegisterMod(MOD_NAME, 1);
const MOD_FEATURES = [
  ISCFeature.RUN_IN_N_FRAMES,
  ISCFeature.CUSTOM_HOTKEYS,
  ISCFeature.SAVE_DATA_MANAGER,
  ISCFeature.EXTRA_CONSOLE_COMMANDS,
  ISCFeature.FAST_RESET,
  ISCFeature.FADE_IN_REMOVER,
  ISCFeature.GAME_REORDERED_CALLBACKS,
  ISCFeature.SPAWN_COLLECTIBLE,
  ISCFeature.PLAYER_INVENTORY,
  ISCFeature.PICKUP_INDEX_CREATION,
  ISCFeature.CHARACTER_STATS,
] as const;

export const mod = upgradeMod(modVanilla, MOD_FEATURES);
