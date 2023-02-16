import { getTSTLClassName, ModFeature } from "isaacscript-common";
import { fprint } from "../helper/printHelper";
import { CMFInputs, CMFInstance } from "../types/CMFInstance";

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

  /** Will init the CMF if it isn't already. */
  protected addInstance(instance: T): number {
    if (!this.initialized) {
      const className = getTSTLClassName(this);
      fprint(`Initializing ${className}...`);
      this.init();
    }

    this.v.run.ids++;
    const id = this.v.run.ids;
    this.v.run.subscribers.set(id, instance);
    return id;
  }

  /** Will unsubscribe from CMF if there are no instances. */
  protected removeInstance(id: number): void {
    this.v.run.subscribers.delete(id);

    if (this.v.run.subscribers.size === 0) {
      fprint(`Uninitialising ${getTSTLClassName(this)}...`);
      this.uninit();
    }
  }

  /** Will unsubscribe from CMF. */
  protected removeAllInstances(): void {
    this.v.run.subscribers.clear();
    this.uninit();
  }

  // eslint-disable-next-line class-methods-use-this
  subscribe(...arg0: any): number {
    error("Should not call this function, it acts as an abstract function.");
  }

  // eslint-disable-next-line class-methods-use-this
  subscribeWithInput(input: CMFInputs): number {
    error("Should not call this function, it acts as an abstract function.");
  }

  // eslint-disable-next-line class-methods-use-this
  unsubscribe(id: number): void {
    error("Should not call this function, it acts as an abstract function.");
  }

  // @Callback(ModCallback.PRE_GAME_EXIT) preGameExit(shouldSave: boolean): void { if (shouldSave) {
  //           return; } this.uninit(); }
}
