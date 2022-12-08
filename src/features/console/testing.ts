import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import { getEnumValues, getRandomArrayElement } from "isaacscript-common";
import { OnFloorAction } from "../../classes/corruption/actions/OnFloorAction";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { CustomModFeatures } from "../../constants/mod/featureConstants";

import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { legibleString } from "../../helper/stringHelper";
import { mod } from "../../mod";

/** Test player */
const player = () => Isaac.GetPlayer(0);
const del1ID = 0;
let del2ID = 0;

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
}

/** Test stuff as the developer with command 'del'. */
export function testingFunction1(): void {
  print(legibleString(action1.getText()));
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  del2ID = CustomModFeatures.EveryItemIsFeature.subscribe(
    CollectibleType.ABADDON,
  );
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(): void {
  CustomModFeatures.EveryItemIsFeature.unsubscribe(del1ID);
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
