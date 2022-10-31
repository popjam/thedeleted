import { mod } from "../../mod";

const v = {
  persistent: {
    negativePersist: true,
  },
};

export function happy99SettingsInit(): void {
  mod.saveDataManager("happy99Settings", v);
}

/** Whether negative effects of an inverted item carry over to the normal item. */
export function setHAPPY99NegativePersistSetting(
  negativeEffectsPersist: boolean,
): void {
  v.persistent.negativePersist = negativeEffectsPersist;
}

/** Whether negative effects of an inverted item carry over to the normal item. */
export function getHAPPY99NegativePersistSetting(): boolean {
  return v.persistent.negativePersist;
}
