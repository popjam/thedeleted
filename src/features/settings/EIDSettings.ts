import { EIDObjectDisplaySetting } from "../../enums/settings/EIDObjectDisplaySetting";
import { mod } from "../../mod";

const v = {
  persistent: {
    EIDTextSetting:
      EIDObjectDisplaySetting.TEXT_AND_ICON as EIDObjectDisplaySetting,
  },
};

export function EIDSettingsInit(): void {
  mod.saveDataManager("EIDSettings", v);
}

/**
 * The method of displaying 'things' (collectibles, trinkets, monsters, etc) in an External Item
 * Description. Note not all things may have icons, so they will resort to text.
 */
export function setEIDTextSetting(setting: EIDObjectDisplaySetting): void {
  v.persistent.EIDTextSetting = setting;
}

/**
 * The method of displaying 'things' (collectibles, trinkets, monsters, etc) in an External Item
 * Description. Note not all things may have icons, so they will resort to text.
 */
export function getEIDTextSetting(): EIDObjectDisplaySetting {
  return v.persistent.EIDTextSetting;
}
