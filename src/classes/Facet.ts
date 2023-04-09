/**
 * Facet class, an extension of 'ModFeature' which facilitates tracking number of subscribers,
 * resubscribing upon exiting and entering the game on a continued save, as automatically
 * uninitialising the Facet upon a new run.
 */

import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getTSTLClassName, ModFeature } from "isaacscript-common";
import { fprint } from "../helper/printHelper";
import { mod } from "../mod";

const v = {
  run: {
    facetSubscriberCount: new Map<string, number>([]),
  },
};

const allFacets: Facet[] = [];

export function facetInit(): void {
  mod.saveDataManager("facetInit", v);
}

/**
 * Returns true if a Facet has more than 0 subscribers. This is used when a Facet is first
 * initializing to determine whether it should be initialized immediately, as ModFeatures get erased
 * upon exiting the game, even if the run is not over.
 *
 * @param facet The Facet to check. Can be a Facet object or the class name of a Facet.
 */
export function doesFacetHaveSubscribers(facet: Facet | string): boolean {
  let className: string | undefined;
  if (typeof facet === "string") {
    className = facet;
  } else {
    className = getTSTLClassName(facet);
  }

  if (className === undefined) {
    error("Failed to get the class name.");
  }

  const count = v.run.facetSubscriberCount.get(className) ?? 0;
  return count > 0;
}

/**
 * Extension of ModFeature, to facilitate individual subscribers. Facets also auto-uninitialize upon
 * the run ending, as they do not do it automatically, as well as auto-init upon exit/continue if
 * there are subscribers.
 */
export class Facet extends ModFeature {
  /** Subscribe to the Facet, if the Facet is not initialized, will do so. */
  subscribe(): void {
    const className = getTSTLClassName(this);
    if (className === undefined) {
      error("Failed to get the class name.");
    }
    const count = v.run.facetSubscriberCount.get(className) ?? 0;
    v.run.facetSubscriberCount.set(className, count + 1);
    fprint(`Subscribed to ${className} (sub count: ${count + 1}).`);
    if (!this.initialized) {
      fprint(`Initializing ${className} due to subscribe().`);
      this.init();
    }
  }

  /**
   * Unsubscribe from the Facet, if the Facet is initialized and there are no more subscribers, will
   * uninitialize it.
   */
  unsubscribe(): void {
    const className = getTSTLClassName(this);
    if (className === undefined) {
      error("Failed to get the class name.");
    }
    const count = v.run.facetSubscriberCount.get(className) ?? 0;
    if (count <= 0) {
      fprint("Tried to unsubscribe from a Facet that had no subscribers.");
    } else {
      fprint(`Unsubscribed from ${className} (sub count: ${count - 1}).`);
      v.run.facetSubscriberCount.set(className, count - 1);
    }
    if (count - 1 <= 0 && this.initialized) {
      fprint(`Uninitialising ${className} due to unsubscribe().`);
      this.uninit();
    }
  }

  /** Unsubscribes all subscribers from the Facet, uninitialising it if not already. */
  unsubscribeAll(): void {
    const className = getTSTLClassName(this);
    if (className === undefined) {
      error("Failed to get the class name.");
    }
    const count = v.run.facetSubscriberCount.get(className) ?? 0;
    if (count <= 0) {
      fprint("Tried to unsubscribe from a Facet that had no subscribers.");
    } else {
      fprint(`Unsubscribed from ${className} (sub count: ${count - 1}).`);
      v.run.facetSubscriberCount.set(className, 0);
    }
    if (this.initialized) {
      fprint(`Uninitialising ${className} due to unsubscribeAll().`);
      this.uninit();
    }
  }

  /** Subscribes to the Facet if it has no subscribers and is uninitialized. */
  subscribeIfNotAlready(): void {
    if (!this.isInitialized()) {
      this.subscribe();
    }
  }

  getSubscriberCount(): int {
    const className = getTSTLClassName(this);
    if (className === undefined) {
      error("Failed to get the class name.");
    }
    return v.run.facetSubscriberCount.get(className) ?? 0;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Uninitialize the Facet upon the run ending, as it does not do it automatically. Save Data is
   * auto-reset.
   */
  @Callback(ModCallback.PRE_GAME_EXIT)
  preGameExit(shouldSave: boolean): void {
    if (shouldSave) {
      return;
    }
    if (this.initialized) {
      fprint(`Uninitialising ${getTSTLClassName(this)} due to PRE_GAME_EXIT.`);
      this.uninit();
    }
  }
}

/**
 * Function to easily set up a Facet (NOT initialize the actual Facet), this should be called in
 * each Facet class file in an init() function.
 */
export function initGenericFacet(facet: typeof Facet, vObject?: object): Facet {
  // eslint-disable-next-line new-cap
  const newFacet = new facet(mod, false);
  allFacets.push(newFacet);
  const facetName = getTSTLClassName(newFacet);
  if (facetName === undefined) {
    error("Failed to get the class name.");
  }

  fprint(`Initializing ${facetName} due to initGenericFacet().`);
  if (vObject !== undefined) {
    mod.saveDataManager(facetName, vObject);
  }
  return newFacet;
}

// POST_GAME_STARTED_REORDERED, isContinued: TRUE. This is called when the game is exited and then
// continued, and is used to reinitialize Facets.
export function facetPostGameContinuedReordered(): void {
  // Reinitialize all Facets that have subscribers.
  for (const facet of allFacets) {
    fprint(`Trying to Re-Init Facet: ${getTSTLClassName(facet)}.`);
    if (doesFacetHaveSubscribers(facet)) {
      if (!facet.initialized) {
        fprint(
          `Re-initializing ${getTSTLClassName(
            facet,
          )} due to POST_GAME_STARTED_REORDERED.`,
        );
        facet.init();
      }
    }
  }
}
