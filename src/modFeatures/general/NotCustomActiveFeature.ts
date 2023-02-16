import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { fprint } from "../../helper/printHelper";
import { CustomModFeature } from "../CustomModFeature";

export interface NotCustomActiveInstance {
  thing: string;
}

export interface NotCustomActiveInput {
  thing: string;
}

export class NotCustomActiveFeature2 extends CustomModFeature<NotCustomActiveInstance> {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    fprint(`Subscriber count for NotCustomActiveFeature2: ${this.v.run.ids}`);
  }
}
