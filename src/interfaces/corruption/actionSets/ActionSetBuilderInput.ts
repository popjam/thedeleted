import { CollectibleType } from "isaac-typescript-definitions";

/** Data sent to ActionSetBuilders. */
export interface ActionSetBuilderInput {
  /** Player who the ActionSet belongs to, may be no-one. */
  player?: EntityPlayer;
  /** Collectible the ActionSet is based on (even if inverted). */
  collectible?: CollectibleType;
}
