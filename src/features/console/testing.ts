import { DoorSlot, EntityType } from "isaac-typescript-definitions";
import {
  getEnumValues,
  getRandomArrayElement,
  getClosestEntityTo,
  getEntities,
  getRoomDescriptor,
  game,
  getRoomGridIndex,
  getRoomAdjacentGridIndexes,
  getNPCs,
  newSprite,
} from "isaacscript-common";
import {
  freezeAllNPCsInRoom,
  unfreezeAllNPCsInRoom,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/FreezeNPCFacet";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { fprint } from "../../helper/printHelper";
import { mod } from "../../mod";
import { getRandomNPC, spawnNPCID } from "../../helper/entityHelper/npcHelper";
import { getQuickAccessiblePosition } from "../../helper/positionHelper";
import { addNPCFlags } from "../../helper/entityHelper/npcFlagHelper";
import { NPCFlag } from "../../enums/general/NPCFlag";
import { spawnNewInvertedCollectible } from "../../helper/deletedSpecific/inversion/spawnInverted";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { OnRoomAction } from "../../classes/corruption/actions/OnRoomAction";
import { OnCardUseAction } from "../../classes/corruption/actions/OnCardUseAction";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { OnActiveUseAction } from "../../classes/corruption/actions/OnActiveUseAction";
import { OnBombExplodeAction } from "../../classes/corruption/actions/OnBombExplodeAction";
import { getSpriteSize } from "../../helper/spriteHelper";
import {
  renderConstantly,
  renderSpriteInCenterOfScreen,
} from "../../helper/renderHelper";
import { getSaveFileData } from "../pc/progression/savefiles";
import { SaveFileType } from "../../enums/progression/SaveFileType";

/** Test player */
const player = () => Isaac.GetPlayer(0);

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
  const saveFileData = getSaveFileData(SaveFileType.NORMAL);
  const happy99Data = saveFileData.characterData.get(
    PlayerTypeCustom.DELETED_HAPPY99,
  );
  if (happy99Data === undefined) {
    return;
  }
  fprint(`Happy99 completed marks: ${happy99Data.completedMarks.size}`);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  const closestNPC = getClosestEntityTo(player(), getNPCs());
  if (closestNPC === undefined) {
    return;
  }

  const ptrHash = GetPtrHash(closestNPC);
  const initSeed = closestNPC.InitSeed;
  const index = closestNPC.Index;
  fprint(
    `Closest NPC: ptrHash - ${ptrHash}, initSeed - ${initSeed}, index - ${index}`,
  );
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(): void {
  const roomGridIndex = getRoomGridIndex();
  const redRoomCreated = game
    .GetLevel()
    .MakeRedRoomDoor(roomGridIndex, DoorSlot.DOWN_0);
  fprint(`Red room created: ${redRoomCreated}`);
  if (redRoomCreated) {
    const adjacentGridIndexes = getRoomAdjacentGridIndexes(roomGridIndex);
    let redRoomGridIndex: number | undefined;
    for (const [doorSlot, gridIndex] of adjacentGridIndexes) {
      if (doorSlot === DoorSlot.DOWN_0) {
        redRoomGridIndex = gridIndex;
        break;
      }
    }

    if (redRoomGridIndex === undefined) {
      return;
    }

    const roomDescriptor = getRoomDescriptor(redRoomGridIndex);
    const roomConfigRoom = roomDescriptor.Data;

    if (roomConfigRoom === undefined) {
      return;
    }

    const newData = game.GetLevel().GetRoomByIdx(-3).Data;
    if (newData === undefined) {
      return;
    }

    roomDescriptor.Data = newData;
  }
}

/** Test stuff as the developer with command 'eted'. */

export function testingFunction4(): void {
  spawnNewInvertedCollectible(
    getQuickAccessiblePosition(),
    new InvertedPassiveActionSet().addEffects(
      new OnBombExplodeAction()
        .setResponse(new UseActiveItemResponse().setAmountOfActivations(3))
        .setFireAfterThenRemove(1),
    ),
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
    return undefined;
  }
  const pickupIndex = mod.getPickupIndex(closestEntity as EntityPickup);
  return pickupIndex;
}
