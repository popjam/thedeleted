import { mod } from "../../mod";

const v = {
  persistent: {
    IncludeModdedNPCInGeneration: true,
  },
};

export function moddedNPCSettingsInit(): void {
  mod.saveDataManager("ModdedNPCSettings", v);
}

/**
 * If set to true (default), will consider modded NPCs upon generating corrupted effects for items.
 * If set to false, will not consider modded NPCs. Note not all mods may be registered.
 */
export function setIncludeModdedNPCInGenerationSetting(setting: boolean): void {
  v.persistent.IncludeModdedNPCInGeneration = setting;
}

/**
 * If set to true (default), will consider modded NPCs upon generating corrupted effects for items.
 * If set to false, will not consider modded NPCs. Note not all mods may be registered.
 */
export function getIncludeModdedNPCInGenerationSetting(): boolean {
  return v.persistent.IncludeModdedNPCInGeneration;
}
