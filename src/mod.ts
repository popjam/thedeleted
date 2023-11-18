import { CacheFlag, PlayerType } from "isaac-typescript-definitions";
import { ISCFeature, upgradeMod } from "isaacscript-common";
import { MOD_NAME } from "./constants/mod/modConstants";
import { fprint } from "./helper/printHelper";

const modVanilla = RegisterMod(MOD_NAME, 1);
const MOD_FEATURES = [
  ISCFeature.RUN_IN_N_FRAMES,
  ISCFeature.CUSTOM_HOTKEYS,
  ISCFeature.SAVE_DATA_MANAGER,
  ISCFeature.EXTRA_CONSOLE_COMMANDS,
  ISCFeature.FAST_RESET,
  ISCFeature.FADE_IN_REMOVER,
  ISCFeature.GAME_REORDERED_CALLBACKS,
  ISCFeature.PICKUP_INDEX_CREATION,
  ISCFeature.CHARACTER_STATS,
  ISCFeature.MODDED_ELEMENT_DETECTION,
  ISCFeature.MODDED_ELEMENT_SETS,
  ISCFeature.COLLECTIBLE_ITEM_POOL_TYPE,
  ISCFeature.PERSISTENT_ENTITIES,
  ISCFeature.PAUSE,
  ISCFeature.ROOM_HISTORY,
  ISCFeature.DISABLE_INPUTS,
  ISCFeature.PLAYER_COLLECTIBLE_TRACKING,
] as const;
// export const ItemDisplayLibrary = CCO.ItemDisplay.API;

export const mod = upgradeMod(modVanilla, MOD_FEATURES);
mod.registerCharacterStats(
  PlayerType.ISAAC,
  new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
);
