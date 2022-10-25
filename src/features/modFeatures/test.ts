import { ModCallback } from "isaac-typescript-definitions";
import { Callback, ModFeature } from "isaacscript-common";

export class TestFeature extends ModFeature {
  v = {
    run: {
      player: 5,
    },
  };

  @Callback(ModCallback.POST_NEW_ROOM)
  postNewRoom(): void {
    print(this.v.run.player);
  }
}
