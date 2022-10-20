import { ModCallback } from "isaac-typescript-definitions";
import { Callback, ModFeature } from "isaacscript-common";

export class TestFeature extends ModFeature {
  // eslint-disable-next-line class-methods-use-this
  @Callback(ModCallback.POST_GAME_STARTED)
  postGameStarted(isContinued: boolean): void {
    print("hi");
  }
}
