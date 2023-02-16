import { game, newRNG } from "isaacscript-common";
import { mod } from "../../mod";

const v = {
  run: {
    RNG: undefined as RNG | undefined,
  },
};

export function RNGHelperInit(): void {
  mod.saveDataManager("RNGHelper", v);
}

export function getRunRNG(): RNG {
  const startingSeed = game.GetSeeds().GetStartSeed();
  if (v.run.RNG === undefined) {
    v.run.RNG = newRNG(startingSeed);
  }
  return v.run.RNG;
}
