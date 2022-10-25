import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import { OnFloorAction } from "../../classes/corruption/actions/OnFloorAction";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { WaitThenTriggerResponse } from "../../classes/corruption/responses/WaitThenTriggerResponse";
import { ModFeatures } from "../../constants/mod/featureConstants";
import { mod } from "../../mod";

/** Test player */
const player = () => Isaac.GetPlayer(0);

/** Testing variables */
const action1 = new OnFloorAction().setLevelStage(LevelStage.WOMB_1);
const item1 = new UseActiveItemResponse().construct(
  CollectibleType.BOOK_OF_SIN,
);
const item2 = new UseActiveItemResponse().construct(
  CollectibleType.CRACK_THE_SKY,
);
const wait = new WaitThenTriggerResponse().construct(item2, 3);

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
  ModFeatures.testFeature.init();
}
/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  ModFeatures.testFeature.uninit();
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(): void {}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction4(): void {}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction5(): void {}
