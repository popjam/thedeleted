import { setupPC } from "../../../classes/facets/pc/PCFacet";

/** Sets up the PC when Deleted spawns in. */
export function mainPCPostPlayerInitDeletedFirst(player: EntityPlayer) {
  setupPC();
}
