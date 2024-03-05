import type { UseFlag } from "isaac-typescript-definitions";
import {
  ActiveSlot,
  ButtonAction,
  CollectibleType,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  getEnumEntries,
  getPlayers,
  getTSTLClassName,
} from "isaacscript-common";
import { addRemovedInvertedItemToTracker } from "../../features/corruption/inventory/removedInvertedItems";
import { fprint } from "../../helper/printHelper";
import { isZazzinatorActive } from "../../sets/zazzSets";
import { Facet, initGenericFacet } from "../Facet";
import type { InvertedActiveActionSet } from "../corruption/actionSets/Inverted/InvertedActiveActionSet";
import {
  doesAnyPlayerHaveAnyCustomActives,
  doesPlayerHaveCustomActive,
  doesPlayerHaveCustomActiveInSlot,
  getAllCustomActives,
  getAllCustomActivesWithSlot,
  getCustomActiveInSlot,
  setCustomActiveInSlot,
} from "../../features/corruption/inversion/customActives";
import {
  _removeZazzActiveFromPlayer,
  doesInvertedActiveActionSetMatchZazzActive,
} from "../../helper/deletedSpecific/inventory/custom actives/customActiveHelper";
import { renderCorruptedCollectibleSpriteInSlot } from "../../helper/deletedSpecific/funnySprites";
import {
  _addActionsToTracker,
  _removeActionFromTracker,
} from "../../features/corruption/effects/playerEffects";
import { ActionType } from "../../enums/corruption/actions/ActionType";
import { getTotalCharges } from "../../helper/activeHelper";
import {
  getPedestalPickingUpData,
  isPlayerPickingUpItem,
} from "../../features/corruption/inversion/lastPickedUpInverted";

/**
 * Corrupted Actives are basically custom active items that can have a unique sprite, effects,
 * charge, etc, modified during the game. To simulate this, we need to set up 'dummy' invisible
 * active items that don't have a name, for every possible charge setting. The sprite will then be
 * rendered on top.
 *
 * What happens when a corrupted active is swapped out? It will appear on the floor as the dummy
 * item, which is not what we want. To solve this, we need to track which corrupted actives have
 * just been removed, then quickly swap them for the collectibleType they represent.
 *
 * Furthermore, custom actives need a way to retain their state after they have been swapped out /
 * placed on the floor. Unlike passives, you can put down an active item, and you don't expect it to
 * instantly have a refreshed charge. To alleviate this, all actives on the floor need to be tracked
 * and have a state (which is just their InvertedActiveActionSet).
 *
 * Custom actives' 'Responses' are triggered upon using the custom active. Custom actives' 'Actions'
 * are added to the player effect pool upon obtaining the custom active, and removed upon the custom
 * active's removal.
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
      /**
       * Edge case where slot 2 is a custom active, and a non-inverted item from slot 1 is removed.
       */
      const slot2Active = getCustomActiveInSlot(player, ActiveSlot.SECONDARY);
      if (
        slot2Active !== undefined &&
        player.GetActiveItem(ActiveSlot.SECONDARY) === CollectibleType.NULL
      ) {
        setCustomActiveInSlot(player, ActiveSlot.PRIMARY, slot2Active);
        setCustomActiveInSlot(player, ActiveSlot.SECONDARY, undefined);
      }
      return;
    }

    fprint(
      `Player removed active item with type: ${collectibleType}. Trying to remove custom active...`,
    );
    checkActiveRemoved(player, collectibleType);

    /** If no one is using the CustomActiveFacet, we unsubscribe. */
    if (!doesAnyPlayerHaveAnyCustomActives()) {
      fprint("No players have custom actives, unsubscribing.");
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
      `Using inverted active item with chargeType: ${actionSet.getChargeType()}, charge: ${actionSet.getCharges()}`,
    );
    return actionSet.use(player, activeSlot as ActiveSlot);
  }

  /**
   * Render callback responsible for rendering the corrupted sprites over the physical dummy items.
   *
   * It also handles swapping the custom actives if a player presses the drop / swap button.
   */
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    // For some reason this callback always runs.
    if (!(FACET?.isInitialized() ?? false)) {
      return;
    }

    for (const player of getPlayers()) {
      // Loop through ActiveSlots and render the custom actives, as well as updating charge
      // tracking.
      for (const activeSlot of getEnumEntries(ActiveSlot)) {
        if (doesPlayerHaveCustomActiveInSlot(player, activeSlot[1])) {
          renderPlayerCustomActive(player, activeSlot[1]);
          updateCustomActiveCurrentCharge(player, activeSlot[1]);
        }
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

  /** We need to re-add Actions to the tracker, as they aren't saved on disk. */
  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, true)
  postGameStartedReordered(): void {
    for (const player of getPlayers()) {
      const customActives = getAllCustomActives(player);
      for (const customActive of customActives) {
        const actions = customActive
          .getActions()
          .filter((action) => action.actionType !== ActionType.ON_OBTAIN);
        _addActionsToTracker(player, ...actions);
      }
    }
  }

  /** Listen out for item switching with schoolbag. */
  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.IS_ACTION_TRIGGERED,
    ButtonAction.DROP,
  )
  inputActionPlayer(player: EntityPlayer): boolean | undefined {
    if (Input.IsActionTriggered(ButtonAction.DROP, player.ControllerIndex)) {
      dropKeyPressed(player);
    }
    return undefined;
  }
}

export function initCustomActiveFacet(): void {
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
  FACET?.subscribeIfNotAlready();

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

  if (player.HasCollectible(CollectibleType.SCHOOLBAG)) {
    fprint("Player has schoolbag, switching primary slot to secondary slot...");
    setCustomActiveInSlot(
      player,
      ActiveSlot.SECONDARY,
      getCustomActiveInSlot(player, ActiveSlot.PRIMARY),
    );
  }
  fprint("Adding inverted active to primary slot...");
  setCustomActiveInSlot(player, ActiveSlot.PRIMARY, actionSet);
}

/** This function fires when the 'drop' (switch active) key is pressed. */
function dropKeyPressed(player: EntityPlayer) {
  // If player doesn't have schoolbag, do nothing.
  if (!player.HasCollectible(CollectibleType.SCHOOLBAG)) {
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
  fprint("Switching custom actives in primary and secondary slot...");
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

/** Update the tracking of the custom active's current charge. */
function updateCustomActiveCurrentCharge(
  player: EntityPlayer,
  slot: ActiveSlot,
) {
  const actionSet = getCustomActiveInSlot(player, slot);
  if (actionSet === undefined) {
    return;
  }

  const charge = getTotalCharges(player, slot);

  // Do not update the charge when player is picking up an item as this messed up extra battery
  // charge.
  if (!isPlayerPickingUpItem(player)) {
    actionSet.setCurrentCharge(charge);
  }
}

/**
 * Given a player and a removed CollectibleType, checks if they have removed a custom active in the
 * and if so, handles it.
 *
 * POST_PLAYER_COLLECTIBLE_REMOVED.
 *
 * @returns True if a custom active was removed.
 */
function checkActiveRemoved(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): boolean {
  const removedActiveSlot = findRemovedCustomActiveSlot(
    player,
    collectibleType,
  );
  fprint(`Removed active slot: ${removedActiveSlot}.`);

  if (removedActiveSlot === undefined) {
    return false;
  }

  const active = getCustomActiveInSlot(player, removedActiveSlot);

  // If the active is undefined, something has gone wrong.
  if (active === undefined) {
    return false;
  }

  // Remove the Actions from the tracker.
  for (const action of active.getActions()) {
    _removeActionFromTracker(player, action);
  }

  // Track removed item.
  addRemovedInvertedItemToTracker(
    player,
    collectibleType,
    active.oi ?? CollectibleType.SAD_ONION,
    active,
  );

  fprint(
    `removed custom active charge at time of removal: ${active.getCurrentCharge()}`,
  );

  // Edge case where custom active in slot1 is removed, and player has schoolbag. In this case, we
  // need to move the custom active in slot2 to slot1 (if there is one).
  if (
    player.HasCollectible(CollectibleType.SCHOOLBAG) &&
    removedActiveSlot === ActiveSlot.PRIMARY
  ) {
    setCustomActiveInSlot(
      player,
      ActiveSlot.PRIMARY,
      getCustomActiveInSlot(player, ActiveSlot.SECONDARY),
    );
    setCustomActiveInSlot(player, ActiveSlot.SECONDARY, undefined);

    fprint(
      `Removed custom active with type: ${active.oi} in slot1, moving slot2 to slot1.`,
    );
    return true;
  }

  // Update data.
  setCustomActiveInSlot(player, removedActiveSlot, undefined);

  fprint(
    `Removed custom active with type: ${active.oi} from slot ${removedActiveSlot}.`,
  );
  return true;
}

/**
 * POST_PLAYER_COLLECTIBLE_REMOVED
 *
 * Given a player and a removed collectibleType, find which slot the removed item was in, given that
 * it was a custom active.
 */
function findRemovedCustomActiveSlot(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): ActiveSlot | undefined {
  if (!isZazzinatorActive(collectibleType)) {
    return undefined;
  }

  const slot1Active = getCustomActiveInSlot(player, ActiveSlot.PRIMARY);
  const slot2Active = getCustomActiveInSlot(player, ActiveSlot.SECONDARY);
  const pocketSlot = getCustomActiveInSlot(player, ActiveSlot.POCKET);
  const singleUsePocket = getCustomActiveInSlot(
    player,
    ActiveSlot.POCKET_SINGLE_USE,
  );

  // Pocket.
  if (
    pocketSlot !== undefined &&
    !isZazzinatorActive(player.GetActiveItem(ActiveSlot.POCKET))
  ) {
    return ActiveSlot.POCKET;
  }

  // Single use pocket.
  if (
    singleUsePocket !== undefined &&
    !isZazzinatorActive(player.GetActiveItem(ActiveSlot.POCKET_SINGLE_USE))
  ) {
    return ActiveSlot.POCKET_SINGLE_USE;
  }

  // Primary no schoolbag.
  if (!player.HasCollectible(CollectibleType.SCHOOLBAG)) {
    if (
      slot1Active !== undefined &&
      !isZazzinatorActive(player.GetActiveItem(ActiveSlot.PRIMARY))
    ) {
      return ActiveSlot.PRIMARY;
    }
    return undefined;
  }

  // Primary schoolbag.
  if (
    slot1Active !== undefined &&
    doesInvertedActiveActionSetMatchZazzActive(slot1Active, collectibleType)
  ) {
    return ActiveSlot.PRIMARY;
  }
  if (
    slot2Active !== undefined &&
    doesInvertedActiveActionSetMatchZazzActive(slot2Active, collectibleType)
  ) {
    return ActiveSlot.SECONDARY;
  }

  fprint(`Failed to find removed custom active slot for ${collectibleType}.`);
  return undefined;
}

export function printCustomActiveStatus(player: EntityPlayer): void {
  const getAllCustomActivesResult = getAllCustomActivesWithSlot(player);
  if (getAllCustomActivesResult.length === 0) {
    fprint(
      `Player has no custom actives. Facet sub count: ${
        FACET?.getSubscriberCount() ?? -1
      }. Initialized: ${FACET?.isInitialized() ?? false}`,
    );
    return;
  }

  for (const customActive of getAllCustomActivesResult) {
    FACET?.subscribe();
    fprint(
      `Player has custom active in slot ${
        customActive[0]
      }: ${customActive[1].getCollectibleType()}. Facet sub count: ${
        FACET?.getSubscriberCount() ?? -1
      }. Initialized: ${FACET?.isInitialized() ?? false}`,
    );
  }
}
