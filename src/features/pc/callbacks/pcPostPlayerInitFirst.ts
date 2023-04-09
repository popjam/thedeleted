import { setupPC } from "../../../classes/facets/pc/PCFacet";

/** Sets up the PC when Deleted spawns in. */
export function mainPCPostPlayerInitDeletedFirst(_player: EntityPlayer): void {
  setupPC();
}
