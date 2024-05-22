import { mod } from "../../mod";

const v = {
  persistent: {
    IncludeModdedSlotsInGeneration: true,
  },
};

export function moddedSlotSettingsInit(): void {
  mod.saveDataManager("ModdedSlotSettings", v);
}

/**
 * If set to true (default), will consider modded pickups upon generating corrupted effects for
 * items. If set to false, will not consider modded pickups. Note not all mods may be registered.
 */
export function setIncludeModdedSlotsInGenerationSetting(
  setting: boolean,
): void {
  v.persistent.IncludeModdedSlotsInGeneration = setting;
}

/**
 * If set to true (default), will consider modded pickups upon generating corrupted effects for
 * items. If set to false, will not consider modded pickups. Note not all mods may be registered.
 */
export function getIncludeModdedSlotsInGenerationSetting(): boolean {
  return v.persistent.IncludeModdedSlotsInGeneration;
}
