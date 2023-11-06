import { mod } from "../../mod";
import type { Percentage } from "../../types/general/Percentage";
import { createPercentage } from "../../types/general/Percentage";

const v = {
  persistent: {
    chanceForNormalItem: 10,
  },
};

export function sophosSettingsInit(): void {
  mod.saveDataManager("SOPHOSSettings", v);
}

/**
 * The chance that an item pedestal spawns as a non-TMTRAINER corrupted item as SOPHOS. Throws error
 * if percentage is not 0-100.
 */
export function setSOPHOSChanceForNormalItemSetting(
  percentage: Percentage,
): void {
  v.persistent.chanceForNormalItem = createPercentage(percentage);
}

/** The chance that an item pedestal spawns as a non-TMTRAINER corrupted item as SOPHOS. */
export function getSOPHOSChanceForNormalItemSetting(): Percentage {
  return v.persistent.chanceForNormalItem;
}
