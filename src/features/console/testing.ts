import {
  EntityType,
  KeySubType,
  LevelStage,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  getClosestEntityTo,
  getEntities,
  getEnumValues,
  getRandomArrayElement,
  VectorOne,
} from "isaacscript-common";
import { OnFloorAction } from "../../classes/corruption/actions/OnFloorAction";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { CustomModFeatures } from "../../constants/mod/featureConstants";

import { subscribeToExampleFacet } from "../../classes/facets/ExampleFacet";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { spawnNewInvertedCollectible } from "../../helper/deletedSpecific/inversion/spawnInverted";
import { getRandomAccessiblePosition } from "../../helper/entityHelper";
import { fprint } from "../../helper/printHelper";
import { mod } from "../../mod";

/** Test player */
const player = () => Isaac.GetPlayer(0);
const del1ID = 2;
const del2ID = 0;

/** Testing variables */
const action1 = new OnFloorAction()
  .setInterval(1)
  .setLevelStage(LevelStage.BLUE_WOMB);
const response1 = new UseActiveItemResponse();
action1.setResponse(response1);

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
}

/** Test stuff as the developer with command 'del'. */
export function testingFunction1(): void {
  spawnNewInvertedCollectible(
    getRandomAccessiblePosition(player().Position) ?? VectorOne,
  );
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  const closestPickup = getClosestEntityTo(
    player(),
    getEntities(EntityType.PICKUP),
  );
  closestPickup
    ?.ToPickup()
    ?.Morph(EntityType.PICKUP, PickupVariant.KEY, KeySubType.NORMAL);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(): void {
  subscribeToExampleFacet(player());
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction4(): void {
  CustomModFeatures.EveryItemIsFeature.unsubscribe(del2ID);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction5(): void {
  const customPlayerTypes = getEnumValues(PlayerTypeCustom);
  const randomPlayerType = getRandomArrayElement(customPlayerTypes);
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
