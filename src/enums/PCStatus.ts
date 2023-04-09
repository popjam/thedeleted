/** Tracks state of PC in starting room. */
export enum PCState {
  /** Player/s have left starting room, rendering it unusable, or before the PC spawns in. */
  OFFLINE,

  /** PC is online, and there may or may not be an active user. */
  ACCOUNT,

  OTHER,
}
