import { PickupVariant } from "isaac-typescript-definitions";
import {
  DefaultMap,
  defaultMapGetPlayer,
  defaultMapSetPlayer,
  getPlayerIndex,
  PlayerIndex,
} from "isaacscript-common";
import { CustomModFeatures } from "../../../constants/mod/featureConstants";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {
  run: {
    cantPickupSubscriptions: new DefaultMap<PlayerIndex, number>(0),
  },
};
const MODE = Mode.ZIPBOMBER;
const MODE_DATA = getModeData(MODE);
const cantPickupVariant = PickupVariant.BOMB;

export function zipbomberInit(): void {
  mod.saveDataManager("zipbomber", v);
}

/** Initiate the player to the MORRIS mode. */
export function zipbomberModeSetup(player: EntityPlayer): void {
  fprint(`ZIP BOMBER: Mode init for player: ${getPlayerIndex(player)}`);

  const id = CustomModFeatures.CantPickupFeature.subscribe(
    player,
    cantPickupVariant,
  );
  defaultMapSetPlayer(v.run.cantPickupSubscriptions, player, id);
}

/** When the player swaps out from MORRIS mode. */
export function zipbomberModeFin(player: EntityPlayer): void {
  const id = defaultMapGetPlayer(v.run.cantPickupSubscriptions, player);
  CustomModFeatures.CantPickupFeature.unsubscribe(id);
}
