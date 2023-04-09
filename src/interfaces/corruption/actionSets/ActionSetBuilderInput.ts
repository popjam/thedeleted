import { CollectibleType } from "isaac-typescript-definitions";

/** Data sent to ActionSetBuilders. */
export interface ActionSetBuilderInput {
  /** Player who the ActionSet belongs to, may be no-one. */
  player?: EntityPlayer;
  /** Collectible the ActionSet is based on (even if inverted). */
  collectible?: CollectibleType;
  /** Set to true to force an active, and false to force a passive. */
  forceActiveOrPassive?: boolean;
}
