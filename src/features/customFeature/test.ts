import { ModCallback } from "isaac-typescript-definitions";
import { Callback, ModFeature } from "isaacscript-common";

export class TestFeature extends ModFeature {
  // eslint-disable-next-line class-methods-use-this
  @Callback(ModCallback.POST_NEW_ROOM)
  postNewRoom(): void {
    print("hi");
  }
}
