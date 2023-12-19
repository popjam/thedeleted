import {
  LevelStage,
  CollectibleType,
  EntityType,
  SoundEffect,
  ChampionColor,
  NPCID,
  EntityFlag,
  Gaper2Variant,
  GaperVariant,
} from "isaac-typescript-definitions";
import {
  getRandomSeed,
  arrayRemove,
  getRandomArrayIndex,
  getEnumValues,
  getCollectibleName,
  getRandomArrayElement,
  getClosestEntityTo,
  getEntities,
  sfxManager,
  GAME_FRAMES_PER_SECOND,
  round,
  getRandomEnumValue,
  arrayToBitFlags,
  spawnEntityID,
} from "isaacscript-common";
import { OnFloorAction } from "../../classes/corruption/actions/OnFloorAction";
import { GetCollectibleResponse } from "../../classes/corruption/responses/GetCollectibleResponse";
import {
  freezeAllNPCsInRoom,
  unfreezeAllNPCsInRoom,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/FreezeNPCFacet";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { getRandomCollectibleType } from "../../helper/collectibleHelper";
import { getQuickAccessiblePosition } from "../../helper/entityHelper";
import { spawnNPCID } from "../../helper/entityHelper/npcIDHelper";
import { fprint } from "../../helper/printHelper";
import { legibleString } from "../../helper/stringHelper";
import { mod } from "../../mod";
import { fireFunctionConstantly } from "../../helper/gameHelper";
import { getSoundEffectLength } from "../../maps/data/sounds/soundLengths";
import {
  getRandomNPC,
  npcAttributesToText,
} from "../../helper/entityHelper/npcHelper";
import { Mods } from "../../enums/compatibility/Mods";
import {
  spawnNewInvertedActiveCollectible,
  spawnNewInvertedCollectible,
} from "../../helper/deletedSpecific/inversion/spawnInverted";
import { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { SpawnNPCResponse } from "../../classes/corruption/responses/SpawnNPCResponse";
import type { NPCAttribute } from "../../interfaces/general/NPCAttribute";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { NPCFlag } from "../../enums/general/NPCFlag";
import { randomInRange } from "../../types/general/Range";
import { addNPCFlags } from "../../helper/entityHelper/npcFlagHelper";
import { printPersistentNPCs } from "../general/NPCIndex";
import { addPermanentStatusEffectToNPC } from "../../classes/facets/entityModifiers.ts/NPCModifiers/PermanentNPCStatusEffectFacet";
import {
  getEntityIDSet,
  getEntityIDSetFromCategory,
} from "../data/gameEntitySetBuilder";
import { EntityCategory } from "../../enums/general/EntityCategory";

/** Test player */
const player = () => Isaac.GetPlayer(0);
const player2 = () => Isaac.GetPlayer(1);

/** Testing variables */
const action1 = new OnFloorAction()
  .setInterval(1)
  .setLevelStage(LevelStage.BLUE_WOMB);
const response1 = new GetCollectibleResponse().construct(CollectibleType.POOP);

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

/** Test stuff as the developer with command 'del'. */
export function testingFunction1(): void {
  const npc = spawnNPCID(
    getRandomNPC() ?? NPCID.GAPER,
    getQuickAccessiblePosition(),
  );
  addNPCFlags(npc, NPCFlag.UNSTABLE);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  const entities = getEntityIDSet();
  let i = 0;
  for (const entity of entities) {
    i++;
    if (i > 100) {
      break;
    }
    spawnEntityID(entity, getQuickAccessiblePosition());
  }
}

function getRandomTest<T>(
  th: T[],
  seedOrRNG: Seed | RNG = getRandomSeed(),
  exceptions: [] = [],
): T {
  if (th.length === 0) {
    error(
      "Failed to get a random array element since the provided array is empty.",
    );
  }

  const newArray = arrayRemove(th, ...exceptions);
  const randomIndex = getRandomArrayIndex(newArray, seedOrRNG);
  const randomElement = newArray[randomIndex];

  if (randomElement === undefined) {
    error(
      `Failed to get a random array element since the random index of ${randomIndex} was not valid.`,
    );
  }

  return randomElement;
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(): void {
  printPersistentNPCs();
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
