import { getEnumValues, KColorDefault } from "isaacscript-common";
import {
  BITFLIP_DESCRIPTION,
  BITFLIP_PINK_DESCRIPTION,
  D14_DESCRIPTION,
  ZAZZ_DESCRIPTION,
} from "../../../constants/mod/itemConstants";
import { EIDColorShortcut } from "../../../enums/compatibility/EID/EIDColor";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { getKColorFromEIDColorShortcut } from "../../../maps/compatibility/EIDColorMap";

/** Initialize EID data. */
export function initEID(): void {
  if (EID === undefined) {
    return;
  }
  initEIDColors(EID);
  initEIDItems(EID);
}

function initEIDItems(EID: EIDInterface) {
  EID.addCollectible(CollectibleTypeCustom.BITFLIP, BITFLIP_DESCRIPTION);
  EID.addCollectible(
    CollectibleTypeCustom.BITFLIP_PINK,
    BITFLIP_PINK_DESCRIPTION,
  );
  EID.addCollectible(CollectibleTypeCustom.D14, D14_DESCRIPTION);
  EID.addCollectible(CollectibleTypeCustom.ZAZZ, ZAZZ_DESCRIPTION);
}

function initEIDColors(EID: EIDInterface) {
  for (const shortcut of getEnumValues(EIDColorShortcut)) {
    const KColor = getKColorFromEIDColorShortcut(shortcut);
    if (KColor === undefined) {
      continue;
    }
    if (typeof KColor === "function") {
      EID.addColor(shortcut, KColorDefault, KColor);
    } else {
      EID.addColor(shortcut, KColor);
    }
  }
}
