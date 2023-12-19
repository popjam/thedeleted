import { getEnumValues, log } from "isaacscript-common";
import { Mods } from "../../enums/compatibility/Mods";
import { isFiendFolioActive } from "./FiendFolio/fiendFolioHelper";
import { isAndromedaActive } from "./Andromeda/andromedaHelper";

/** Retrieve a list of all known active mods. */
export function getActiveMods(): Mods[] {
  const modList = [];
  for (const mod of getEnumValues(Mods)) {
    if (mod === Mods.FIEND_FOLIO && isFiendFolioActive()) {
      modList.push(mod);
    } else if (mod === Mods.ANDROMEDA && isAndromedaActive()) {
      modList.push(mod);
    }
  }
  return modList;
}
