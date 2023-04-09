import { mod } from "../../mod";

const v = {
  persistent: {
    themedActionSet: true,
  },
};

export function EIDSettingsInit(): void {
  mod.saveDataManager("EIDSettings", v);
}

/**
 * If set to true, the ActionSet color theme will match the Deleted players' main color. If set to
 * false, will use default white/yellow/red colors to indicate Morality of effects.
 */
export function setActionSetThemeSetting(themedActionSet: boolean): void {
  v.persistent.themedActionSet = themedActionSet;
}

/**
 * If set to true, the ActionSet color theme will match the Deleted players' main color. If set to
 * false, will use default white/yellow/red colors to indicate Morality of effects.
 */
export function getActionSetThemeSetting(): boolean {
  return v.persistent.themedActionSet;
}
