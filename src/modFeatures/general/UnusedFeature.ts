// eslint-disable-next-line max-classes-per-file
import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { fprint } from "../../helper/printHelper";
import { CustomModFeature } from "../CustomModFeature";

export interface UnusedFeatureInstance {
  thing: string;
}

export class UnusedFeature extends CustomModFeature<UnusedFeatureInstance> {
  override v = {
    run: {
      subscribers: new Map<number, UnusedFeatureInstance>([]),
      ids: 0,
    },
  };

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    fprint(`Subscriber count for UNUSED FEATURE: ${this.v.run.ids}`);
  }
}

export interface CustomActiveInstance {
  thing: string;
}

export class NAONDAONDWA extends CustomModFeature<CustomActiveInstance> {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    fprint(`Subscriber count for NAONDAONDWA: ${this.v.run.ids}`);
  }
}
