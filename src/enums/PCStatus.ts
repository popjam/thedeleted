/** Tracks state of PC in starting room. */
export enum PCState {
  /** Player/s have left starting room, rendering it unusable. */
  OFFLINE,

  /** PC is online, but there are no current users. */
  ACCOUNT,

  OTHER,
}
