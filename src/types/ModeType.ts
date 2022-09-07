import { Mode } from "../enums/modes/Mode";

/** Subset of the Mode enum for Tainted Deleted modes. */
export type TaintedMode = undefined;

/** Subset of the Mode enum for Normal Deleted modes. */
export type NormalMode = Exclude<Mode, TaintedMode>;
