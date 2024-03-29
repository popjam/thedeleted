import {
  CollectibleType,
  EntityType,
  GridEntityType,
} from "isaac-typescript-definitions";
import type { EntityID } from "isaacscript-common";
import {
  getEnumValues,
  getCollectibleName,
  getRandomArrayElement,
  getClosestEntityTo,
  getEntities,
  removeGridEntities,
  spawnGridEntity,
} from "isaacscript-common";
import {
  freezeAllNPCsInRoom,
  unfreezeAllNPCsInRoom,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/FreezeNPCFacet";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { getRandomCollectibleType } from "../../helper/collectibleHelper";
import { fprint } from "../../helper/printHelper";
import { legibleString } from "../../helper/stringHelper";
import { mod } from "../../mod";
import { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import {
  getAllEmptyGridIndexes,
  positionToClampedGridIndex,
} from "../../helper/gridEntityHelper/gridEntityHelper";
import { OnRoomAction } from "../../classes/corruption/actions/OnRoomAction";
import { SpawnHybridNPCResponse } from "../../classes/corruption/responses/SpawnHybridNPCResponse";
import type { NPCAttribute } from "../../interfaces/general/NPCAttribute";
import {
  getEntityIDFromEntities2XMLDataEntry,
  getEntitiesXMLData,
} from "../../helper/xmlHelper";
import {
  getEntityIDSet,
  getEntityIDSetFromCategory,
  getPickupIDSetOfPickupType,
} from "../data/gameSets/gameSets";
import { getEntityNameFromEntityID } from "../../helper/entityHelper/entityIDHelper";
import { EntityCategory } from "../../enums/general/EntityCategory";
import { PickupType } from "../../enums/general/PickupType";

/** Test player */
const player = () => Isaac.GetPlayer(0);
const player2 = () => Isaac.GetPlayer(1);

/** Add all the testing commands. */
export function addTestingCommands(): void {
  mod.addConsoleCommand("del1", () => {
    testingFunction1();
  });
  mod.addConsoleCommand("del2", () => {
    testingFunction2();
  });
  mod.addConsoleCommand("del3", () => {
    testingFunction3();
  });
  mod.addConsoleCommand("del4", () => {
    testingFunction4();
  });
  mod.addConsoleCommand("del5", () => {
    testingFunction5();
  });
  mod.addConsoleCommand("pindex", () => {
    getClosestPickupIndex();
  });
  mod.addConsoleCommand("pause", () => {
    freezeAllNPCsInRoom();
  });
  mod.addConsoleCommand("unpause", () => {
    unfreezeAllNPCsInRoom();
  });
}

const responseToAdd = new SpawnHybridNPCResponse().construct({
  boss: false,
  flying: true,
} as NPCAttribute);
const actionToAdd = new OnRoomAction().setResponse(responseToAdd);

const actionSetToAdd = new InvertedActiveActionSet().addEffects(responseToAdd);

/** Test stuff as the developer with command 'del'. */
export function testingFunction1(): void {
  const allEntities = getPickupIDSetOfPickupType(PickupType.COLLECTIBLE);

  // Print them all.
  for (const entity of allEntities) {
    fprint(getEntityNameFromEntityID(entity as EntityID));
  }
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  const emptyGridIndices = getAllEmptyGridIndexes();
  const randomEmptyGridIndex = getRandomArrayElement(
    emptyGridIndices,
    undefined,
  );

  // Spawn rock at random empty grid index.
  const gridEntity = spawnGridEntity(GridEntityType.ROCK, randomEmptyGridIndex);

  if (gridEntity === undefined) {
    return;
  }

  // Remove rock.
  removeGridEntities([gridEntity], false);

  // Function.
  const func = () =>
    spawnGridEntity(
      GridEntityType.LOCK,
      positionToClampedGridIndex(gridEntity.Position),
      false,
    );

  // Spawn a lock at same position.
  mod.runInNGameFrames(func, 1);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(): void {
  mod.runInNGameFrames(testingFunction2, 30);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction4(): void {
  const item1 = getRandomCollectibleType() ?? CollectibleTypeCustom.BITFLIP;
  const item2 = getRandomCollectibleType() ?? CollectibleType.ABADDON;
  fprint(
    `Combining ${getCollectibleName(item1)} and ${getCollectibleName(item2)}:`,
  );
  fprint(
    `-----> ${legibleString(
      combineWords(
        getCollectibleName(item1),
        getCollectibleName(item2),
      ).toLowerCase(),
    )}`,
  );
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction5(): void {
  const customPlayerTypes = getEnumValues(PlayerTypeCustom);
  const randomPlayerType = getRandomArrayElement(customPlayerTypes, undefined);
  player().ChangePlayerType(randomPlayerType);
}

/** Test stuff as the developer with command 'eted'. */
function getClosestPickupIndex(): number | undefined {
  const closestEntity = getClosestEntityTo(
    player(),
    getEntities(EntityType.PICKUP),
  );
  if (closestEntity === undefined) {
    fprint("No entity found");
    return;
  }
  const pickupIndex = mod.getPickupIndex(closestEntity as EntityPickup);
  return pickupIndex;
}

function combineWords(word1: string, word2: string): string {
  // Split words into arrays of characters
  const chars1 = word1.split("");
  const chars2 = word2.split("");

  // Find vowel and consonant indices in each word
  const vowels1 = chars1.reduce<number[]>((indices, char, index) => {
    if ("aeiouAEIOU".includes(char)) {
      indices.push(index);
    }
    return indices;
  }, []);
  const consonants1 = chars1.reduce<number[]>((indices, char, index) => {
    if (!"aeiouAEIOU".includes(char)) {
      indices.push(index);
    }
    return indices;
  }, []);
  const vowels2 = chars2.reduce<number[]>((indices, char, index) => {
    if ("aeiouAEIOU".includes(char)) {
      indices.push(index);
    }
    return indices;
  }, []);
  const consonants2 = chars2.reduce<number[]>((indices, char, index) => {
    if (!"aeiouAEIOU".includes(char)) {
      indices.push(index);
    }
    return indices;
  }, []);

  // Choose random indices to split the words.
  let splitIndex1 = Math.floor(Math.random() * chars1.length);
  let splitIndex2 = Math.floor(Math.random() * chars2.length);
  let joinedChar1 = chars1[splitIndex1];
  let joinedChar2 = chars2[splitIndex2];

  // Ensure that the resulting word doesn't have more than three consonants in a row.
  let combinedWord: string | undefined;

  let iterations = 0;
  while (
    combinedWord === undefined ||
    consonantsInARow(combinedWord) > 2 ||
    combinedWord.length < Math.ceil((chars1.length + chars2.length) / 2)
  ) {
    iterations++;
    if (iterations > 100_000 && combinedWord !== undefined) {
      break;
    }

    splitIndex1 = Math.floor(Math.random() * chars1.length);
    joinedChar1 = chars1[splitIndex1];
    splitIndex2 = Math.floor(Math.random() * chars2.length);
    joinedChar2 = chars2[splitIndex2];

    // Combine words at chosen indices.
    combinedWord =
      word1.slice(0, Math.max(0, splitIndex1)) +
      word2.slice(Math.max(0, splitIndex2));
  }

  return combinedWord;
}

// Helper function to count the number of consonants in a row in a given string.
function consonantsInARow(str: string): number {
  let maxConsonantsInARow = 0;
  let currentConsonantsInARow = 0;

  for (const element of str) {
    if ("aeiouAEIOU".includes(element)) {
      currentConsonantsInARow = 0;
    } else {
      currentConsonantsInARow++;
      maxConsonantsInARow = Math.max(
        maxConsonantsInARow,
        currentConsonantsInARow,
      );
    }
  }
  return maxConsonantsInARow;
}
