import { CorruptionDNA } from "./corruption/CorruptionDNA";

/** A bunch of settings unique to each player. */
export interface PlayerSettings {
  startingCoins?: number;
  startingKeys?: number;
  startingBombs?: number;
  corruptionDNA?: CorruptionDNA;
}
