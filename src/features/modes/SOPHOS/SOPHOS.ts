/** The traditional Tainted Deleted mode. */

import { getPlayersOfType, setCollectibleGlitched } from "isaacscript-common";
import { PlayerTypeCustom } from "../../../enums/general/PlayerTypeCustom";
import { fprint } from "../../../helper/printHelper";
import { rollPercentage } from "../../../types/general/Percentage";
import { getSOPHOSChanceForNormalItemSetting } from "../../settings/SOPHOSSettings";

const PLAYER_TYPE = PlayerTypeCustom.T_DELETED_SOPHOS;
const DEFAULT_SHOP_PRICE_WHEN_TOO_HIGH = 7;
const MAXIMUM_SHOP_PRICE = 30;

/** Initiate the player to the SOPHOS mode. */
export function sophosModeSetup(player: EntityPlayer): void {}

/** When the player swaps out from SOPHOS mode. */
export function sophosModeFin(player: EntityPlayer): void {}

/**
 * When a pedestal spawns and a SOPHOS player exists, make it a TMTRAINER item. There's a chance it
 * will not become a glitched item, specified by SOPHOSChanceForNormalItemSetting.
 */
// POST_PICKUP_INIT_LATE, PickupVariant.COLLECTIBLE
export function sophosPostPickupInitFirst(
  collectible: EntityPickupCollectible,
): void {
  if (getPlayersOfType(PLAYER_TYPE).length === 0) {
    return;
  }
  // Chance for normal item setting.
  if (!rollPercentage(getSOPHOSChanceForNormalItemSetting())) {
    setCollectibleGlitched(collectible);
    fprint(
      `Glitched collectible ${collectible.SubType} is of price: ${collectible.Price}`,
    );
    collectible.AutoUpdatePrice = false;
    if (collectible.Price > MAXIMUM_SHOP_PRICE) {
      fprint("SOPHOS: Price too high, setting lower...");
      collectible.Price = DEFAULT_SHOP_PRICE_WHEN_TOO_HIGH;
    }
  }
}
