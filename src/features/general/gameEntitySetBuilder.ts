import type { NPCID } from "isaac-typescript-definitions";
import { fprint } from "../../helper/printHelper";
import {
  getGameModdedNPCIDSet,
  getGameNPCIDSet,
  getGameNonModdedNPCIDSet,
} from "../../sets/data/entities/GameNPCIDSets";
import { game, getEnumValues } from "isaacscript-common";
import { getActiveMods } from "../../helper/compatibility/externalModHelper";
import { getNPCIDNameSubTypesForMod } from "../../maps/data/npc/modded/ModToNameSubTypeMap";
import {
  getEntityIDFromEntity,
  getEntityIDFromNameSubType,
} from "../../helper/entityHelper/entityIDHelper";
import { EntityCategory } from "../../enums/general/EntityCategory";
import {
  getBaseEntityIDSetForCategory,
  getGameEntityIDSetForCategory,
  getGameModdedEntityIDSetForCategory,
  getGameNonModdedEntityIDSetForCategory,
} from "../../maps/data/categoryToSetMaps";
import {
  _addModdedEntityIDToNameSubTypeMap,
  _clearModdedEntityIDToNameSubTypeMap,
} from "../../maps/data/moddedEntityIDToNameSubType";
import {
  _addModdedEntityIDToModMap,
  _clearModdedEntityIDToModMap,
} from "../../maps/data/moddedEntityIDToModMap";
import { getNPCIDSetForMod } from "../../maps/data/npc/modded/ModToGameSetMaps";

/**
 * Upon starting or continuing a game, re-populate the game EntityID sets
 * (e.g. gameNPCIDSet, gamePickupIDSet, etc.). These sets hold reference to all non-modded and known
 * modded entities in the game for easy access.
 */
export function populateGameEntityIDSets(): void {
  // NPCID Sets.
  fprint("Populating game EntityID sets..");

  // Add non-modded NPCs:
  populateNonModdedEntities();

  // Add to modded sets / maps. Sets will already be populated with base entities.
  populateModdedEntities();
}

/** Populate non-modded + modded & non-modded sets. */
function populateNonModdedEntities() {
  for (const category of getEnumValues(EntityCategory)) {
    const gameNonModdedEntityIDSetOfCategory =
      getGameNonModdedEntityIDSetForCategory(category);
    const gameEntityIDSetOfCategory = getGameEntityIDSetForCategory(category);

    if (
      gameEntityIDSetOfCategory === undefined ||
      gameNonModdedEntityIDSetOfCategory === undefined
    ) {
      continue;
    }

    gameEntityIDSetOfCategory.clear();
    gameNonModdedEntityIDSetOfCategory.clear();

    const baseEntityIDSet = getBaseEntityIDSetForCategory(category);
    if (baseEntityIDSet === undefined) {
      continue;
    }

    for (const entity of baseEntityIDSet) {
      gameEntityIDSetOfCategory.add(entity);
      gameNonModdedEntityIDSetOfCategory.add(entity);
    }
  }
}

function populateModdedEntities() {
  _clearModdedEntityIDToNameSubTypeMap();
  _clearModdedEntityIDToModMap();

  for (const mod of getActiveMods()) {
    for (const category of getEnumValues(EntityCategory)) {
      let moddedNameSubTypes: Set<string> | undefined;

      if (category === EntityCategory.NPC) {
        moddedNameSubTypes = getNPCIDNameSubTypesForMod(mod);
      } else {
        continue;
      }

      if (moddedNameSubTypes === undefined) {
        continue;
      }

      // Get sets.
      const gameEntityIDSetForCategory =
        getGameEntityIDSetForCategory(category);
      const gameModdedEntityIDSetForCategory =
        getGameModdedEntityIDSetForCategory(category);

      if (
        gameEntityIDSetForCategory === undefined ||
        gameModdedEntityIDSetForCategory === undefined
      ) {
        continue;
      }

      // Clear sets (base entity sets are already cleared and populated).
      gameModdedEntityIDSetForCategory.clear();

      // We now have a set of modded nameSubTypes for this mod and category.
      for (const nameSubType of moddedNameSubTypes) {
        const entityID = getEntityIDFromNameSubType(nameSubType);
        if (entityID === undefined) {
          continue;
        }

        if (category === EntityCategory.NPC) {
          const moddedNPCIDSet = getNPCIDSetForMod(mod);
          if (moddedNPCIDSet !== undefined) {
            moddedNPCIDSet.add(entityID as NPCID);
          }
        }

        // Add IDs to modded sets.
        gameEntityIDSetForCategory.add(entityID);
        gameModdedEntityIDSetForCategory.add(entityID);

        // Add IDs to modded maps.
        _addModdedEntityIDToNameSubTypeMap(entityID, nameSubType);
        _addModdedEntityIDToModMap(entityID, mod);
      }
    }
  }
}

export function postGameStartedReorderedGameEntitySetBuilder(
  _isContinued: boolean,
): void {
  populateGameEntityIDSets();
}
