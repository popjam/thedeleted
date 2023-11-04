import { getRandomInt } from "isaacscript-common";

/** Returns a random rotation as an integer from 0 to 360. */
export function getRandomRotation(seedOrRNG?: Seed | RNG | undefined): number {
  return getRandomInt(0, 360, seedOrRNG);
}
