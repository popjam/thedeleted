import { nextSeed } from "isaacscript-common";

/** Helper function to iterate the seed by X amount. */
export function nextSeeds(seed: Seed, amount: number): Seed {
  for (let i = 0; i < amount; i++) {
    seed = nextSeed(seed);
  }
  return seed;
}
