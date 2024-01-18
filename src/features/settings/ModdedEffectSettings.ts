import { mod } from "../../mod";

const v = {
  persistent: {
    IncludeModdedEffectsInGeneration: true,
  },
};

export function moddedEffectSettingsInit(): void {
  mod.saveDataManager("ModdedEffectSettings", v);
}

/**
 * If set to true (default), will consider modded effects upon generating corrupted effects for
 * items. If set to false, will not consider modded effects. Note not all mods may be registered.
 */
export function setIncludeModdedEffectsInGenerationSetting(
  setting: boolean,
): void {
  v.persistent.IncludeModdedEffectsInGeneration = setting;
}

/**
 * If set to true (default), will consider modded effects upon generating corrupted effects for
 * items. If set to false, will not consider modded effects. Note not all mods may be registered.
 */
export function getIncludeModdedEffectsInGenerationSetting(): boolean {
  return v.persistent.IncludeModdedEffectsInGeneration;
}
