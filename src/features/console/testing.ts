import type { NPCID } from "isaac-typescript-definitions";
import { DoorSlot, EntityType } from "isaac-typescript-definitions";
import {
  getEnumValues,
  getRandomArrayElement,
  getClosestEntityTo,
  getEntities,
  getRandomSetElement,
  getRoomListIndex,
  getRooms,
  getRoomData,
  getRoomDescriptor,
  game,
  getRoomGridIndex,
  getRoomAdjacentGridIndexes,
} from "isaacscript-common";
import {
  freezeAllNPCsInRoom,
  unfreezeAllNPCsInRoom,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/FreezeNPCFacet";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { fprint } from "../../helper/printHelper";
import { mod } from "../../mod";
import { getEntityIDSetFromCategory } from "../data/gameSets/gameSets";
import { OnRoomAction } from "../../classes/corruption/actions/OnRoomAction";
import { addTemporaryActionToPlayer } from "../corruption/effects/playerEffects";
import { GetCollectibleResponse } from "../../classes/corruption/responses/GetCollectibleResponse";
import { EntityCategory } from "../../enums/general/EntityCategory";
import { SpawnHybridNPCResponse } from "../../classes/corruption/responses/SpawnHybridNPCResponse";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { spawnNewInvertedCollectible } from "../../helper/deletedSpecific/inversion/spawnInverted";
import { getQuickAccessiblePosition } from "../../helper/positionHelper";
import { SpawnEffectResponse } from "../../classes/corruption/responses/SpawnEffectResponse";
import { EffectID } from "../../enums/data/ID/EffectID";

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
  const newResponse = new GetCollectibleResponse();

  const newAction = new OnRoomAction().setInterval(3);

  const responseSeverity = newResponse.getSeverity();
  const actionSeverity = newAction.getIdealSeverity();

  // We will now multiply the absolute response severity to match the ideal action severity.
  const severityMultiplier = actionSeverity / Math.abs(responseSeverity);

  // Round to 0 decimal places.
  const severityMultiplierRounded = Math.round(severityMultiplier);
  const amountOfActivations = newResponse.getAmountOfActivations();
  if (typeof amountOfActivations !== "number") {
    return;
  }

  newResponse.setAmountOfActivations(
    amountOfActivations * severityMultiplierRounded,
  );

  newAction.setResponse(newResponse);
  addTemporaryActionToPlayer(player(), newAction);

  fprint(
    `Response severity: ${newResponse.getSeverity()}, Action ideal severity: ${newAction.getIdealSeverity()}, Action: ${newAction.getText()}`,
  );
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  const roomData = getRoomData();
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
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function testingFunction4(): void {}

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
