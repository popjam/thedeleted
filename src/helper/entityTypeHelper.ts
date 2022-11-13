import { EntityType } from "isaac-typescript-definitions";
import { FIRST_NPC_ENTITY_TYPE } from "../constants/npcConstants";

/** Does not work with modded Entities. */
export function isNPC(entityType: EntityType): boolean {
  return (
    entityType > FIRST_NPC_ENTITY_TYPE && entityType < EntityType.GENERIC_PROP
  );
}
