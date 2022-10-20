import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { OnFloorAction } from "../../classes/corruption/actions/OnFloorAction";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { Morality } from "../../enums/corruption/Morality";
import { mod } from "../../mod";

/** Test player */
const player = () => Isaac.GetPlayer(0);

/** Testing variables */
const action1 = new OnFloorAction().setLevelStage(LevelStage.WOMB_1);
const response1 = new UseActiveItemResponse().construct(
  Morality.POSITIVE,
  CollectibleType.BOOK_OF_SIN,
);
action1.setResponse(response1);

/** Add all the testing commands. */
export function addTestingCommands(): void {
  mod.addConsoleCommand("del1", () => {
    testingFunction1(mod);
  });
  mod.addConsoleCommand("del2", () => {
    testingFunction2(mod);
  });
  mod.addConsoleCommand("del3", () => {
    testingFunction3(mod);
  });
  mod.addConsoleCommand("del4", () => {
    testingFunction4(mod);
  });
  mod.addConsoleCommand("del5", () => {
    testingFunction5(mod);
  });
}

/** Test stuff as the developer with command 'del'. */
export function testingFunction1(mod: ModUpgraded): void {}
/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(mod: ModUpgraded): void {}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(mod: ModUpgraded): void {}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction4(mod: ModUpgraded): void {}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction5(mod: ModUpgraded): void {}
