import { isPCActive } from "../../classes/facets/pc/PCFacet";
import { mod } from "../../mod";

/**
 * This file is responsible for the UI of the PC:
 * TODO: Separate into multiple UI files.
 */

const v = {};

export function uiPCInit(): void {
  mod.saveDataManager("uiPC", v);
}

/** Render the PC UI. */
export function uiPCPostRender(): void {
  if (isPCActive()) {
  }
}
