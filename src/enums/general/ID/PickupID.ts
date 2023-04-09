import { EntityType, PickupVariant } from "isaac-typescript-definitions";

/** An enum of EntityIDs which correlate to a Pickup. */
export const PickupID = {
  BED: `${EntityType.PICKUP}.${PickupVariant.BED}.0`,
} as const;

/** EntityIDs which correlate to a Pickup. */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PickupID = (typeof PickupID)[keyof typeof PickupID];
