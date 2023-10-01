import type { UseFlag } from "isaac-typescript-definitions";
import {
  ActiveSlot,
  ButtonAction,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  getEnumEntries,
  getPlayers,
  hasOpenActiveItemSlot,
} from "isaacscript-common";
import { addRemovedInvertedItemToTracker } from "../../features/corruption/inventory/removedInvertedItems";
import { fprint } from "../../helper/printHelper";
import { isZazzinatorActive } from "../../sets/zazzSets";
import { Facet, initGenericFacet } from "../Facet";
import type { InvertedActiveActionSet } from "../corruption/actionSets/Inverted/InvertedActiveActionSet";
import {
  doesAnyPlayerHaveAnyCustomActives,
  getCustomActiveInSlot,
  setCustomActiveInSlot,
} from "../../features/corruption/inversion/customActives";
import { doesInvertedActiveActionSetMatchZazzActive } from "../../helper/deletedSpecific/inversion/customActiveHelper";
import { renderCorruptedCollectibleSpriteInSlot } from "../../helper/deletedSpecific/funnySprites";
import { getZazzActiveFromCharge } from "../../maps/activeChargeToZazzActive";

/**
 * Corrupted Actives are basically custom active items that can have a unique sprite, effects,
 * charge, etc, modified during the game. To simulate this, we need to set up 'dummy' invisible
 * active items that don't have a name, for every possible charge setting. The sprite will then be
 * rendered on top. However, there are a few problems:
 *
 * 1 - Tracking the custom pocket item active is relatively simple, you can tell exactly what
 * PocketItem position it is in. The only problem occurs when you have the dice bag trinket.
 *
 * 2 - Tracking corrupted active items in Primary and Secondary slot is more difficult, as there is
 * no way to tell which corrupted active is in which slot, if both have the same charge (and hence
 * the same dummy item). To solve this, we need to have two sets of dummy items, and if a player has
 * one from one set the next one should be from the other set.
 *
 * 3 - What happens when a corrupted active is swapped out? It will appear on the floor as the dummy
 * item, which is not what we want. To solve this, we need to track which corrupted actives have
 * just been removed, then quickly swap them for the collectibleType they represent.
 */
let FACET: Facet | undefined;
class CustomActiveFacet extends Facet {
  /** If an Active-Dummy item is removed, we must update this Facet. */
  @CallbackCustom(ModCallbackCustom.POST_PLAYER_COLLECTIBLE_REMOVED)
  postPlayerCollectibleRemoved(
    player: EntityPlayer,
    collectibleType: CollectibleType,
  ): void {
    /** We only care about zazzinator actives. */
    if (!isZazzinatorActive(collectibleType)) {
      return;
    }

    checkPocketActiveRemoved(player, collectibleType);
    checkActiveRemoved(player, collectibleType);

    /** If no one is using the CustomActiveFacet, we unsubscribe. */
    if (doesAnyPlayerHaveAnyCustomActives()) {
      this.unsubscribeAll();
    }
  }

  /** When an inverted active is used, all the Responses are immediately triggered. */
  @Callback(ModCallback.POST_USE_ITEM)
  postUseItem(
    collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    _useFlags: BitFlags<UseFlag>,
    activeSlot: int,
    _customVarData: int,
  ):
    | boolean
    | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
    | undefined {
    if (!isZazzinatorActive(collectibleType)) {
      return undefined;
    }

    /** Find which InvertedActiveActionSet is being used. */
    const actionSet = getCustomActiveInSlot(player, activeSlot as ActiveSlot);

    // TODO: It should never be undefined, so if it is something should be done..
    if (actionSet === undefined) {
      return undefined;
    }

    fprint(
      `Using inverted active item with chargeType: ${actionSet.getChargeType()}, charge: ${actionSet.getCharges()}, isCopy: ${
        actionSet.copy ?? false
      }`,
    );
    return actionSet.use(player);
  }

  /**
   * Render callback responsible for rendering the corrupted sprites over the physical dummy items.
   *
   * It also handles swapping the custom actives if a player presses the drop / swap button.
   */
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    for (const player of getPlayers()) {
      // Handle drop (swap) button being pressed.
      if (Input.IsActionTriggered(ButtonAction.DROP, player.ControllerIndex)) {
        dropKeyPressed(player);
      }

      // Loop through ActiveSlots and render the custom actives.
      for (const activeSlot of getEnumEntries(ActiveSlot)) {
        renderPlayerCustomActive(player, activeSlot[1]);
      }
    }
  }

  /** Edge case where normal active is added, push corrupted item in slot1 to slot2. */
  @CallbackCustom(ModCallbackCustom.POST_PLAYER_COLLECTIBLE_ADDED)
  postPlayerCollectibleAdded(
    player: EntityPlayer,
    collectibleType: CollectibleType,
  ): void {
    if (
      player.HasCollectible(CollectibleType.SCHOOLBAG) &&
      !isZazzinatorActive(collectibleType)
    ) {
      const primaryActive = getCustomActiveInSlot(player, ActiveSlot.PRIMARY);
      if (
        primaryActive !== undefined &&
        !isZazzinatorActive(player.GetActiveItem(ActiveSlot.PRIMARY))
      ) {
        setCustomActiveInSlot(player, ActiveSlot.SECONDARY, primaryActive);
        setCustomActiveInSlot(player, ActiveSlot.PRIMARY, undefined);
      }
    }
  }
}

export function initHUDRenderingFacet(): void {
  FACET = initGenericFacet(CustomActiveFacet);
}

/**
 * Adds an InvertedActiveActionSet to the player. This function shouldn't get called, and you should
 * instead use the addInvertedActionSetToPlayer() or addInvertedItemToPlayer() functions.
 *
 * All this does is update the CustomActiveFacet, and it doesn't actually add the items.
 */
export function _addInvertedActiveToPlayer(
  player: EntityPlayer,
  actionSet: InvertedActiveActionSet,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
): void {
  // Pocket item.
  if (slot === ActiveSlot.POCKET) {
    fprint("Adding inverted active to pocket slot...");
    setCustomActiveInSlot(player, ActiveSlot.POCKET, actionSet);
    return;
  }

  // Single use pocket item (unimplemented).
  if (slot === ActiveSlot.POCKET_SINGLE_USE) {
    fprint("Adding inverted active to single use pocket slot...");
    setCustomActiveInSlot(player, ActiveSlot.POCKET_SINGLE_USE, actionSet);
    return;
  }

  // Primary or secondary slot.
  if (
    !player.HasCollectible(CollectibleType.SCHOOLBAG) ||
    hasOpenActiveItemSlot(player)
  ) {
    fprint("Adding inverted active to primary slot...");
    setCustomActiveInSlot(player, ActiveSlot.PRIMARY, actionSet);
    return;
  }

  // Player has schoolbag and no empty slots...
  const customActivePrimary = getCustomActiveInSlot(player, ActiveSlot.PRIMARY);
  if (customActivePrimary !== undefined) {
    fprint("Switching inverted active in primary slot to secondary slot...");
    setCustomActiveInSlot(player, ActiveSlot.SECONDARY, customActivePrimary);
    return;
  }
  fprint("Adding inverted active to primary slot...");
  setCustomActiveInSlot(player, ActiveSlot.PRIMARY, actionSet);

  FACET?.subscribeIfNotAlready();
}

/** Removes the InvertedActiveActionSet */
export function _removeInvertedActiveFromPlayer(
  player: EntityPlayer,
  actionSet: InvertedActiveActionSet,
  collectibleType: CollectibleType,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
): void {
  const active = getCustomActiveInSlot(player, slot);

  if (active === undefined) {
    return false;
  }

  addRemovedInvertedItemToTracker(
    player,
    collectibleType ??
      getZazzActiveFromCharge(
        active.getChargeType(),
        active.getCharges(),
        active.copy,
      ),
    active.oi ?? CollectibleType.SAD_ONION,
  );

  setCustomActiveInSlot(player, slot, undefined);
}

/** This function fires when the 'drop' (switch active) key is pressed. */
function dropKeyPressed(player: EntityPlayer) {
  // If player has schoolbag, do nothing.
  if (player.HasCollectible(CollectibleType.SCHOOLBAG)) {
    return;
  }

  // If player has no active in the secondary slot, do nothing.
  if (player.GetActiveItem(ActiveSlot.SECONDARY) === CollectibleType.NULL) {
    return;
  }

  const primarySlotCustomActive = getCustomActiveInSlot(
    player,
    ActiveSlot.PRIMARY,
  );
  const secondarySlotCustomActive = getCustomActiveInSlot(
    player,
    ActiveSlot.SECONDARY,
  );

  // If player has no custom actives, do nothing.
  if (
    primarySlotCustomActive === undefined &&
    secondarySlotCustomActive === undefined
  ) {
    return;
  }

  // Switch the custom actives.
  setCustomActiveInSlot(player, ActiveSlot.PRIMARY, secondarySlotCustomActive);
  setCustomActiveInSlot(player, ActiveSlot.SECONDARY, primarySlotCustomActive);
}

/**
 * Renders a custom active the player has in the specified slot (and does nothing if the player has
 * no custom active in that slot).
 */
function renderPlayerCustomActive(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
) {
  const actionSet = getCustomActiveInSlot(player, activeSlot);
  if (actionSet === undefined) {
    return;
  }

  const icon = actionSet.getIcon();
  renderCorruptedCollectibleSpriteInSlot(player, icon, activeSlot);
}

/**
 * Given a player and a removed collectibleType, tries to remove the corresponding custom active (if
 * it exists).
 */
function checkPocketActiveRemoved(
  player: EntityPlayer,
  collectibleType: CollectibleType,
) {
  const pocketSlot = getCustomActiveInSlot(player, ActiveSlot.POCKET);
  if (pocketSlot === undefined) {
    return;
  }

  if (player.GetActiveItem(ActiveSlot.POCKET) !== CollectibleType.NULL) {
    return;
  }

  if (
    !doesInvertedActiveActionSetMatchZazzActive(pocketSlot, collectibleType)
  ) {
    return;
  }

  // There is no custom active in the pocket slot, but there is a dummy item.
  addRemovedInvertedItemToTracker(
    player,
    collectibleType,
    pocketSlot.oi ?? CollectibleType.SAD_ONION,
  );
  setCustomActiveInSlot(player, ActiveSlot.POCKET, undefined);
}

/**
 * Given a player and a removed CollectibleType, checks if they have removed a custom active in the
 * primary or secondary slot, and if so, adds it to the removed inverted item tracker.
 */
function checkActiveRemoved(
  player: EntityPlayer,
  collectibleType: CollectibleType,
) {
  if (hasSchoolbag) {
    if (activeSlot2 !== undefined && activeSlot1 !== undefined) {
      /**
       * If the custom active in slot1 has been removed (e.g when a new active is picked up), and
       * the player had 2 custom actives, the physical active from slot2 will immediately move down
       * to slot1 after slot1 collectible is removed.
       */

      // There will be nothing in slot2 at this time.
      if (player.GetActiveItem(ActiveSlot.SECONDARY) === CollectibleType.NULL) {
        const itemInSlot1 = player.GetActiveItem(ActiveSlot.PRIMARY);

        // Item in slot1 should be replica of slot2 custom active.
        if (
          isZazzinatorActive(itemInSlot1) && // Check if the physical item from slot2 is now found in slot1.
          doesInvertedActiveActionSetMatchZazzActive(activeSlot2, itemInSlot1)
        ) {
          // The ActiveSet that was in slot1 has been removed.
          activeSlot1.removeFromPlayer(
            player,
            activeSlot1.oi as CollectibleType,
            false,
            true,
          );
          addRemovedInvertedItemToTracker(
            player,
            collectibleType,
            (activeSlot1.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
          );
          v.run.activeSlot1.set(playerIndex, activeSlot2);
          v.run.activeSlot2.delete(playerIndex);
        }
      }
    } else if (activeSlot2 === undefined && activeSlot1 !== undefined) {
      /** If there is a custom active in slot1, but a non-custom active in slot2. */
      const itemInSlot1 = player.GetActiveItem(ActiveSlot.PRIMARY);
      if (!isZazzinatorActive(itemInSlot1)) {
        // The ActiveSet that was in slot1 has been removed.
        activeSlot1.removeFromPlayer(
          player,
          activeSlot1.oi as CollectibleType,
          false,
          true,
        );
        addRemovedInvertedItemToTracker(
          player,
          collectibleType,
          (activeSlot1.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
        );
        v.run.activeSlot1.delete(playerIndex);
      }
    }
  } else if (
    activeSlot1 !== undefined &&
    !isZazzinatorActive(player.GetActiveItem(ActiveSlot.PRIMARY))
  ) {
    activeSlot1.removeFromPlayer(
      player,
      activeSlot1.oi as CollectibleType,
      false,
      true,
    );
    addRemovedInvertedItemToTracker(
      player,
      collectibleType,
      (activeSlot1.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
    );
    v.run.activeSlot1.delete(playerIndex);
  }
}
