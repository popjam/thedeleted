import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";

/** Initialize EID data. */
export function initEID(): void {
  if (EID === undefined) {
    return;
  }
  initEIDItems(EID);
  initEIDDescriptionModifiers(EID);
}

function initEIDItems(EID: EIDInterface) {
  EID.addCollectible(CollectibleTypeCustom.BITFLIP, "Bitflip Description.");
}

function initEIDDescriptionModifiers(EID: EIDInterface) {}
