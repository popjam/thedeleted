import { PickupVariant } from "isaac-typescript-definitions";
import { PickupIndex, spawnPickup } from "isaacscript-common";
import { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInvertedPickupActionSet";
import { fprint } from "../../../helper/printHelper";
import { mod } from "../../../mod";

const v = {
  run: {
    /**
     * Pickups with corrupted effects attached. Pickups do not spawn with default ActionSets, and
     * need to have them added manually through other means.
     *
     * These effects do not affect Inverted items (and differ in that they apply to a singular
     * Entity instead of being shared for the same CollectibleType.)
     */
    pickup: new Map<PickupIndex, NonInvertedPickupActionSet>(),
  },
};

export function pickupEffectsInit(): void {
  mod.saveDataManager("pickupEffects", v);
}

/**
 * Retrieves the non-inverted Pickup ActionSet (which is unique per PickupIndex), setting it to an
 * empty ActionSet if non-existent.
 */
export function getNonInvertedPickupActionSet(
  pickup: EntityPickup,
): NonInvertedPickupActionSet | undefined {
  return v.run.pickup.get(mod.getPickupIndex(pickup));
}

export function setNonInvertedPickupActionSet(
  pickup: EntityPickup,
  actionSet: NonInvertedPickupActionSet,
): void {
  v.run.pickup.set(mod.getPickupIndex(pickup), actionSet);
}

export function spawnPickupWithActionSet(
  pickupVariant: PickupVariant,
  subType: number,
  position: Vector,
  actionSet: NonInvertedPickupActionSet,
): EntityPickup {
  const pickup = spawnPickup(pickupVariant, subType, position);
  setNonInvertedPickupActionSet(pickup, actionSet);
  return pickup;
}

// POST_PICKUP_COLLECT.
/**
 * When a non-inverted pickup (only works with some pickups, e.g ones which disappear when you touch
 * them) is picked up, if it has an ActionSet, trigger it.
 */
export function pickupEffectPostPickupCollect(
  pickup: EntityPickup,
  player: EntityPlayer,
): void {
  const pickupActionSet = getNonInvertedPickupActionSet(pickup);
  if (pickupActionSet === undefined) {
    return;
  }
  pickupActionSet.trigger(player);
  fprint(
    `pickupEffect: Pickup of variant ${pickup.Variant} collected with corrupted effects.`,
  );
}
