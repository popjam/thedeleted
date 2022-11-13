import {
  BITFLIP_DESCRIPTION,
  BITFLIP_PINK_DESCRIPTION,
  D14_DESCRIPTION,
  ZAZZ_DESCRIPTION,
} from "../../../constants/mod/itemConstants";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";

/** Initialize EID data. */
export function initEID(): void {
  if (EID === undefined) {
    return;
  }
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
