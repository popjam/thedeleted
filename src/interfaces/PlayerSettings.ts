import { CorruptionDNA } from "./corruption/CorruptionDNA";

/** A bunch of settings unique to each player. */
export interface PlayerSettings {
  corruptionDNA?: CorruptionDNA;
}
