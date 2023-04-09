import { mod } from "../mod";

const RUN_INDEX_LIMIT = 100;

const v = {
  persistent: {
    runIndex: 1,
  },
};

export function runIndexInit(): void {
  mod.saveDataManager("runIndex", v);
}

export function runIndexPostGameContinuedFacet(): void {
  if (v.persistent.runIndex > RUN_INDEX_LIMIT) {
    v.persistent.runIndex = 0;
  }
  v.persistent.runIndex++;
}

/** A random number that is different each run. */
export function getRunIndex(): number {
  return v.persistent.runIndex;
}
