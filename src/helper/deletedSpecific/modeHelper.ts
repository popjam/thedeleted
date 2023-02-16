/** Functions related to the players' 'Modes'. */

import {
  NormalModeCarousel,
  TaintedModeCarousel,
} from "../../constants/pcConstants";
import { getCurrentPlayerMode, setPlayerMode } from "../../features/modes/mode";
import { fprint } from "../printHelper";
import { isModeTainted } from "./deletedHelper";

export function switchToNextModeOnCarousel(player: EntityPlayer): void {
  const mode = getCurrentPlayerMode(player);
  if (mode === undefined) {
    fprint("Cannot switch modes on a non-Deleted player.");
    return;
  }

  let carousel = NormalModeCarousel;
  if (isModeTainted(mode)) {
    carousel = TaintedModeCarousel;
  }

  const nextMode = carousel[(carousel.indexOf(mode) + 1) % carousel.length];
  if (nextMode === undefined) {
    fprint("Cannot switch to an undefined mode.");
    return;
  }

  setPlayerMode(player, nextMode);
}
