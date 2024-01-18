import { mod } from "../../mod";

const v = {
  persistent: {
    IncludeModdedPickupsInGeneration: true,
  },
};

export function moddedPickupSettingsInit(): void {
  mod.saveDataManager("ModdedPickupSettings", v);
}

/**
 * If set to true (default), will consider modded pickups upon generating corrupted effects for
 * items. If set to false, will not consider modded pickups. Note not all mods may be registered.
 */
export function setIncludeModdedPickupsInGenerationSetting(
  setting: boolean,
): void {
  v.persistent.IncludeModdedPickupsInGeneration = setting;
}

/**
 * If set to true (default), will consider modded pickups upon generating corrupted effects for
 * items. If set to false, will not consider modded pickups. Note not all mods may be registered.
 */
export function getIncludeModdedPickupsInGenerationSetting(): boolean {
  return v.persistent.IncludeModdedPickupsInGeneration;
}
