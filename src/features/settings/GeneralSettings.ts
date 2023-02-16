import { mod } from "../../mod";

const v = {
  persistent: {
    advancedInvertedItemIcons: true,
  },
};

export function GeneralSettingsInit(): void {
  mod.saveDataManager("GeneralSettings", v);
}

/**
 * If set to True, corrupted icons will be TMTRAINER-like amalgamations, which will take more
 * resources. If set to False, they will be the original icons but modified. Note that even if set
 * to False, TMTRAINER-like items can be forced.
 */
export function setAdvancedInvertedItemIconSetting(setting: boolean): void {
  v.persistent.advancedInvertedItemIcons = setting;
}

/**
 * If set to True, corrupted icons will be TMTRAINER-like amalgamations, which will take more
 * resources. If set to False, they will be the original icons but modified. Note that even if set
 * to False, TMTRAINER-like items can be forced.
 */
export function getAdvancedInvertedItemIconSetting(): boolean {
  return v.persistent.advancedInvertedItemIcons;
}
