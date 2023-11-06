import {
  ActiveSlot,
  BombSubType,
  ChestSubType,
  CoinSubType,
  CollectibleType,
  EffectVariant,
  EntityCollisionClass,
  EntityFlag,
  EntityType,
  Gaper2Variant,
  HeartSubType,
  ItemConfigChargeType,
  ItemPoolType,
  ItemType,
  KeySubType,
  LaserSubType,
  LaserVariant,
  LevelStage,
  ModCallback,
  PickupVariant,
  SortingLayer,
} from "isaac-typescript-definitions";
import type { EntityID } from "isaacscript-common";
import {
  COLORS,
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ModFeature,
  VectorZero,
  arrayRemove,
  arrayToString,
  game,
  getClosestEntityTo,
  getCollectibleName,
  getEntities,
  getEnumKeys,
  getEnumValues,
  getKeys,
  getNPCs,
  getPlayerIndex,
  getRandomArrayElement,
  getRandomArrayIndex,
  getRandomEnumValue,
  getRandomInt,
  getRandomSeed,
  getTSTLClassName,
  log,
  sfxManager,
  spawnEffect,
  spawnEntityID,
  spawnKey,
  spawnLaser,
  spawnNPC,
  spawnPickup,
} from "isaacscript-common";
import { OnFloorAction } from "../../classes/corruption/actions/OnFloorAction";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";

import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { SoundEffectCustom } from "../../enums/general/SoundEffectCustom";
import {
  getRandomCollectibleType,
  spawnGlitchedCollectible,
} from "../../helper/collectibleHelper";
import { addNewInvertedActiveToPlayer } from "../../helper/deletedSpecific/inventory/custom actives/invertedActives";
import {
  getQuickAccessiblePosition,
  getRandomAccessiblePosition,
  makeEntityInvisible,
  spawnInvisibleEntity,
} from "../../helper/entityHelper";
import { fprint } from "../../helper/printHelper";
import { renderConstantly } from "../../helper/renderHelper";
import { copySprite } from "../../helper/spriteHelper";
import { legibleString } from "../../helper/stringHelper";
import { mod } from "../../mod";
import { printCustomActiveStatus } from "../../classes/facets/CustomActiveFacet";
import { getAllCustomActives } from "../corruption/inversion/customActives";
import { addActionOrResponseToTracker } from "../corruption/effects/playerEffects";
import { addResponsesToTracker } from "../../helper/deletedSpecific/effects/responseHelper";
import { GetCollectibleResponse } from "../../classes/corruption/responses/GetCollectibleResponse";
import {
  spawnInvertedCollectible,
  spawnNewInvertedCollectible,
} from "../../helper/deletedSpecific/inversion/spawnInverted";
import { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { OnRoomAction } from "../../classes/corruption/actions/OnRoomAction";
import {
  getRandomTMTRAINERActiveItem,
  getRandomTMTRAINERItem,
} from "../../helper/tmtrainerHelper";
import { TMTRAINER_UNIQUE_LIMIT } from "../../constants/tmtrainerConstants";
import { setInvertedItemActionSet } from "../../helper/deletedSpecific/effects/itemEffects";
import { getGameInvertedItemActionSet } from "../../helper/deletedSpecific/generation/corruptionGeneration";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import type {
  ActiveCollectibleAttribute,
  CollectibleAttribute,
} from "../../interfaces/general/CollectibleAttribute";
import { getEIDTextSetting, setEIDTextSetting } from "../settings/EIDSettings";
import { EIDObjectDisplaySetting } from "../../enums/settings/EIDObjectDisplaySetting";
import { RemoveCollectibleResponse } from "../../classes/corruption/responses/RemoveCollectibleResponse";
import { addNPCFlags } from "../../helper/entityHelper/npcFlagHelper";
import { NPCFlag } from "../../enums/general/NPCFlag";
import {
  getAllChildrenNPCs,
  getAllParentNPCs,
  getLastParentNPC,
  getNPCLineage,
  getNPCFamily,
  areNPCsRelated,
  getRandomNPC,
  isEntityNPC,
} from "../../helper/entityHelper/npcHelper";
import {
  bolsterAllNPCsInRoom,
  bolsterNPC,
  unbolsterAllNPCsInRoom,
  unbolsterNPC,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/BolsterNPCFacet";
import {
  freezeAllNPCsInRoom,
  freezeNPC,
  unfreezeAllNPCsInRoom,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/FreezeNPCFacet";
import { makeNPCNonMandatory } from "../../classes/facets/entityModifiers.ts/NPCModifiers/NonMandatoryNPCFacet";
import { censorNPC } from "../../classes/facets/entityModifiers.ts/NPCModifiers/CensoredNPCFacet";
import { fireFunctionConstantly } from "../../helper/gameHelpter";
import { spawnNPCWithNPCID } from "../../helper/npcIDHelper";
import { setEntityInstability } from "../../classes/facets/entityModifiers.ts/UnstableEntityFacet";
import {
  getHideNPCFacet,
  hideNPC,
  unhideNPC,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/HideNPCFacet";
import { Facet } from "../../classes/Facet";
import { setupPC } from "../../classes/facets/pc/PCFacet";
import { spawnHybridNPC } from "../../classes/facets/entityModifiers.ts/NPCModifiers/HybridNPCFacet";
import { randomInRangeWithDecimalPrecision } from "../../types/general/Range";
import { NPCID } from "../../enums/general/ID/NPCID";
import { SpawnNPCResponse } from "../../classes/corruption/responses/SpawnNPCResponse";
import { EntityList } from "../../sets/data/entityList";

/** Test player */
const player = () => Isaac.GetPlayer(0);
const player2 = () => Isaac.GetPlayer(1);
const del1ID = 2;
const del2ID = 0;

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
  const npcIDs: EntityID[] = [];
  const entityListValues = getEnumValues(EntityList);
  for (const ent of entityListValues) {
    const entity = spawnEntityID(ent as EntityID, getQuickAccessiblePosition());
    if (entity === undefined) {
      continue;
    }
    const npc = entity.ToNPC();
    if (npc !== undefined) {
      npcIDs.push(ent as EntityID);
    }
    entity.Remove();
  }

  // Print new EntityList:
  for (const ent of npcIDs) {
    const key = getEnumKeys(EntityList).find(
      (k) => EntityList[k as keyof typeof EntityList] === ent,
    );
    log(`${key} = '${ent}',`);
  }

  // Check which npcIDs are not in NPCID enum:
  const npcIDValues = getEnumValues(NPCID);

  // Check which NPCIDs are not in npcIDs:
  for (const npcID of npcIDValues) {
    if (!npcIDs.includes(npcID as EntityID)) {
      log(`${npcID} is not in npcIDs.`);
    }
  }
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  spawnEntityID("3.237.0" as EntityID, getQuickAccessiblePosition());
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
  const toPrint = [];
  const countedNPCs = new Set<NPCID>();
  log("NPC size:");
  for (const npcid of getEnumValues(NPCID)) {
    countedNPCs.add(npcid);
    const npc = spawnNPCWithNPCID(npcid, getQuickAccessiblePosition());
    const enumKey = getEnumKeys(NPCID).find(
      (key) => NPCID[key as keyof typeof NPCID] === npcid,
    );
    toPrint.push(`[NPCID.${enumKey},${npc.ToNPC()?.Scale}]`);
    npc.Remove();
  }
  const toPrintFirstHalf = toPrint.slice(0, toPrint.length / 2);
  const toPrintSecondHalf = toPrint.slice(toPrint.length / 2);
  log(toPrintFirstHalf.join(","));
  log(toPrintSecondHalf.join(","));

  if (countedNPCs.size !== getEnumValues(NPCID).length) {
    log("Missing NPCs:");
    for (const npcid of getEnumValues(NPCID)) {
      if (!countedNPCs.has(npcid)) {
        const enumKey = getEnumKeys(NPCID).find(
          (key) => NPCID[key as keyof typeof NPCID] === npcid,
        );
        log(`${enumKey}`);
      }
    }
  }
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

// Helper function to count the number of consonants in a row in a given string
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
