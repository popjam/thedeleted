import {
  EntityType,
  GridEntityType,
  NPCID,
  RoomType,
} from "isaac-typescript-definitions";
import type { EntityID } from "isaacscript-common";
import {
  getEnumValues,
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
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { fprint } from "../../helper/printHelper";
import { mod } from "../../mod";
import {
  getAllEmptyGridIndexes,
  positionToClampedGridIndex,
} from "../../helper/gridEntityHelper/gridEntityHelper";
import { getPickupIDSetOfPickupType } from "../data/gameSets/gameSets";
import { getEntityNameFromEntityID } from "../../helper/entityHelper/entityIDHelper";
import { PickupType } from "../../enums/general/PickupType";
import { SpawnNPCResponse } from "../../classes/corruption/responses/SpawnNPCResponse";
import { OnRoomAction } from "../../classes/corruption/actions/OnRoomAction";
import { addTemporaryActionToPlayer } from "../corruption/effects/playerEffects";
import { GetCollectibleResponse } from "../../classes/corruption/responses/GetCollectibleResponse";

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
