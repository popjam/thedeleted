import { getPlayerIndex, PlayerIndex } from "isaacscript-common";
import { Facet, initGenericFacet } from "../Facet";

const v = {
  run: {
    playerUsingFacet: undefined as PlayerIndex | undefined,
  },
};

let FACET: Facet | undefined;
class ExampleFacet extends Facet {
  thing = 3;
}

export function initExampleFacet(): void {
  FACET = initGenericFacet(ExampleFacet, v);
}

export function subscribeToExampleFacet(player: EntityPlayer): void {
  if (FACET === undefined) {
    error("The example facet is not initialized.");
  }

  v.run.playerUsingFacet = getPlayerIndex(player);
  if (!FACET.isInitialized()) {
    FACET.subscribe();
  }
}

export function unsubscribeFromExampleFacet(): void {
  if (FACET === undefined) {
    error("The example facet is not initialized.");
  }

  v.run.playerUsingFacet = undefined;
  FACET.unsubscribe();
}

export function howManySubscribersDoesExampleFacetHave(): int {
  if (FACET === undefined) {
    error("The example facet is not initialized.");
  }

  return FACET.getSubscriberCount();
}

export function isExampleFacetInitialized(): boolean {
  if (FACET === undefined) {
    return false;
  }

  return FACET.isInitialized();
}
