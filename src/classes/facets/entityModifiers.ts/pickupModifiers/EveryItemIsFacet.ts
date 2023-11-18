import {
  CollectibleType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import type { PickupIndex } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  DefaultMap,
  ModCallbackCustom,
  getCollectibleName,
  getCollectibles,
  getTSTLClassName,
  setCollectibleSubType,
} from "isaacscript-common";
import {
  doesCollectibleTypeMatchAttributes,
  getRandomCollectibleType,
} from "../../../../helper/collectibleHelper";
import { objectToString } from "../../../../helper/objectHelper";
import { fprint } from "../../../../helper/printHelper";
import type { CollectibleAttribute } from "../../../../interfaces/general/CollectibleAttribute";
import { mod } from "../../../../mod";
import { Facet, initGenericFacet } from "../../../Facet";

const MORPH_LIMIT = 10;

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  run: {
    everyItemIs: undefined as
      | CollectibleType
      | CollectibleAttribute
      | undefined,
  },
  level: {
    /**
     * Tracks number of times a pickup has been morphed, to prevent endless loops when another mod
     * wants to do the same thing.
     */
    convertedPickups: new DefaultMap<PickupIndex, number>(0),
  },
};

let FACET: Facet | undefined;
class EveryItemIsFacet extends Facet {
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_CHANGED,
    PickupVariant.COLLECTIBLE,
  )
  postPickupChanged(pickup: EntityPickup): void {
    pickup = pickup as EntityPickupCollectible;
    const { everyItemIs } = v.run;

    if (everyItemIs === undefined) {
      return;
    }

    morphItem(pickup, everyItemIs, MORPH_LIMIT);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_LATE,
    PickupVariant.COLLECTIBLE,
  )
  postPickupInitLate(pickup: EntityPickup): void {
    pickup = pickup as EntityPickupCollectible;
    const { everyItemIs } = v.run;

    if (everyItemIs === undefined) {
      return;
    }

    morphItem(pickup, everyItemIs, MORPH_LIMIT);
  }
}

export function initEveryItemIsFacet(): void {
  FACET = initGenericFacet(EveryItemIsFacet, v);
}

/**
 * After calling this function, every pedestal will be the specified CollectibleType, or share the
 * specified CollectibleAttributes. This includes all existing pedestals. Call removeEveryItemIs()
 * to undo this. If you call this function multiple times, the last call will take precedence.
 */
export function everyItemIs(
  // eslint-disable-next-line @typescript-eslint/no-shadow
  everyItemIs: CollectibleType | CollectibleAttribute,
): void {
  v.run.everyItemIs = everyItemIs;

  /**
   * We need to Morph preexisting collectibles in the room. Don't check for endless loops as this
   * will only run once not infinitely.
   */
  for (const pickup of getCollectibles()) {
    morphItem(pickup, everyItemIs);
  }

  FACET?.subscribeIfNotAlready();
}

export function removeEveryItemIs(): void {
  v.run.everyItemIs = undefined;

  FACET?.unsubscribeAll();
}

function morphItem(
  pickup: EntityPickup,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  everyItemIs: CollectibleType | CollectibleAttribute,
  iterationsTilStop: undefined | number = undefined,
) {
  if ((pickup.SubType as CollectibleType) === CollectibleType.NULL) {
    return;
  }

  const isCollectibleType = typeof everyItemIs === "number";

  /** Checking if the original pickup already matches the everyItemIs condition. */
  if (isCollectibleType) {
    if ((pickup.SubType as CollectibleType) === everyItemIs) {
      return;
    }
  } else if (
    doesCollectibleTypeMatchAttributes(
      pickup.SubType as CollectibleType,
      everyItemIs,
    )
  ) {
    return;
  }

  /** Prevent endless loops. */
  if (iterationsTilStop !== undefined) {
    const amountMorphed = v.level.convertedPickups.getAndSetDefault(
      mod.getPickupIndex(pickup),
    );
    if (amountMorphed >= iterationsTilStop) {
      fprint(
        `EveryItemIsFacet: Morph limit reached for ${mod.getPickupIndex(
          pickup,
        )}`,
      );
      return;
    }
  }

  /** Do the morphing. */
  const originalSubType = pickup.SubType as CollectibleType;
  if (isCollectibleType) {
    setCollectibleSubType(pickup, everyItemIs);
  } else {
    const randomCollectible = getRandomCollectibleType(everyItemIs);
    fprint(
      `EveryItemIsFacet: Random collectible for ${objectToString(
        everyItemIs,
      )} is ${randomCollectible}`,
    );
    if (randomCollectible === undefined) {
      fprint(
        `EveryItemIsFacet: No collectible found for ${objectToString(
          everyItemIs,
        )}`,
      );
      return;
    }

    setCollectibleSubType(pickup, randomCollectible);
  }
  fprint(
    `EveryItemIsFacet: Morphing ${getCollectibleName(
      originalSubType,
    )} to ${getCollectibleName(pickup)}`,
  );
}
