import { PickupVariant } from "isaac-typescript-definitions";
import { getPlayerIndex } from "isaacscript-common";
import {
  removePlayerCantPickup,
  setPlayerCantPickup,
} from "../../../classes/facets/gameModifiers.ts/CantPickupFacet";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.ZIPBOMBER;
const MODE_DATA = getModeData(MODE);
const cantPickupVariant = PickupVariant.BOMB;

export function zipbomberInit(): void {
  mod.saveDataManager("zipbomber", v);
}

/** Initiate the player to the MORRIS mode. */
export function zipbomberModeSetup(player: EntityPlayer): void {
  fprint(`ZIP BOMBER: Mode init for player: ${getPlayerIndex(player)}`);

  setPlayerCantPickup(player, cantPickupVariant);
}

/** When the player swaps out from MORRIS mode. */
export function zipbomberModeFin(player: EntityPlayer): void {
  removePlayerCantPickup(player, cantPickupVariant);
}
