import { getEntityID, ReadonlyMap } from "isaacscript-common";
import type { PickupID } from "../../../enums/data/ID/PickupID";

/** Time is in seconds that a pickup takes to 'extract'. */
const EXTRACT_PICKUP_BURN_TIME_MAP = new ReadonlyMap<PickupID, number>([]);

/** The size of the explosion from the pickup when extracted. */
const EXTRACT_PICKUP_EXPLOSION_DMG_MAP = new ReadonlyMap<PickupID, number>([]);

/** Get the amount of seconds a pickup should take to blow up with the Extract item. */
export function getPickupExtractBurnTime(
  pickup: EntityPickup,
): number | undefined {
  return EXTRACT_PICKUP_BURN_TIME_MAP.get(getEntityID(pickup) as PickupID);
}

/** Get the DMG of the explosion from the pickup when extracted. */
export function getPickupExtractExplosionDmg(
  pickup: EntityPickup,
): number | undefined {
  return EXTRACT_PICKUP_EXPLOSION_DMG_MAP.get(getEntityID(pickup) as PickupID);
}
