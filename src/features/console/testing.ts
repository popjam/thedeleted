import { CollectibleType } from "isaac-typescript-definitions";
import { getEnumValues, getRandomArrayElement } from "isaacscript-common";
import { OnDamageAction } from "../../classes/corruption/actions/OnDamageAction";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { WaitThenTriggerResponse } from "../../classes/corruption/responses/WaitThenTriggerResponse";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { Mode } from "../../enums/modes/Mode";
import { mod } from "../../mod";
import { setPlayerMode } from "../modes/mode";

/** Test player */
const player = () => Isaac.GetPlayer(0);

/** Testing variables */
const action1 = new OnDamageAction();
const item1 = new UseActiveItemResponse().construct(
  CollectibleType.BOOK_OF_SIN,
);
const item2 = new UseActiveItemResponse().construct(
  CollectibleType.CRACK_THE_SKY,
);
const wait = new WaitThenTriggerResponse().construct(item2, 3);
action1.setResponse(item1);

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
  setPlayerMode(player(), Mode.ILOVEYOU);
}
/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  setPlayerMode(player(), Mode.HAPPY99);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(): void {
  setPlayerMode(player(), Mode.SOPHOS);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction4(): void {}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction5(): void {
  const customPlayerTypes = getEnumValues(PlayerTypeCustom);
  const randomPlayerType = getRandomArrayElement(customPlayerTypes);
  player().ChangePlayerType(randomPlayerType);
}
