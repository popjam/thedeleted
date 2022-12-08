import { ModCallback } from "isaac-typescript-definitions";
import { Callback, ModFeature } from "isaacscript-common";
import { CMFInstance } from "../types/CMFInstance";

/**
 * A parent class for all custom mod features. This differentiates from 'ModFeature' in that:
 *
 * It handles removing features at the end of the run. It provides templates for subscribing and
 * unsubscribing.
 */
export class CustomModFeature<T extends CMFInstance> extends ModFeature {
  v = {
    run: {
      subscribers: new Map<number, T>([]),
      ids: 0,
    },
  };

  protected addInstance(instance: T): number {
    if (!this.initialized) {
      this.init();
    }

    this.v.run.ids++;
    const id = this.v.run.ids;
    this.v.run.subscribers.set(id, instance);
    return id;
  }

  protected removeInstance(id: number): void {
    this.v.run.subscribers.delete(id);
  }

  // eslint-disable-next-line class-methods-use-this
  subscribe(...arg0: any): number {
    error("Should not call this function, it acts as an abstract function.");
  }

  // eslint-disable-next-line class-methods-use-this
  subscribeWithInstance(instance: T): number {
    error("Should not call this function, it acts as an abstract function.");
  }

  // eslint-disable-next-line class-methods-use-this
  unsubscribe(id: number): void {
    error("Should not call this function, it acts as an abstract function.");
  }

  @Callback(ModCallback.PRE_GAME_EXIT)
  preGameExit(shouldSave: boolean): void {
    if (shouldSave) {
      return;
    }
    this.uninit();
  }
}
