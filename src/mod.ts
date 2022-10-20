import { ISCFeature, upgradeMod } from "isaacscript-common";
import { MOD_NAME } from "./constants/modConstants";

const modVanilla = RegisterMod(MOD_NAME, 1);
const MOD_FEATURES = [
  ISCFeature.CUSTOM_HOTKEYS,
  ISCFeature.SAVE_DATA_MANAGER,
  ISCFeature.EXTRA_CONSOLE_COMMANDS,
  ISCFeature.FAST_RESET,
  ISCFeature.FADE_IN_REMOVER,
  ISCFeature.GAME_REORDERED_CALLBACKS,
  ISCFeature.RUN_IN_N_FRAMES,
  ISCFeature.SPAWN_COLLECTIBLE,
  ISCFeature.PLAYER_INVENTORY,
  ISCFeature.PICKUP_INDEX_CREATION,
] as const;

export const mod = upgradeMod(modVanilla, MOD_FEATURES);
