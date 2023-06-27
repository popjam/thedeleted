import {
  ActiveSlot,
  ButtonAction,
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  PlayerIndex,
  getActivePocketItemSlot,
  getCollectibleChargeType,
  getCollectibleMaxCharges,
  getPlayerIndex,
  getPlayers,
  hasOpenActiveItemSlot,
  isColor,
} from "isaacscript-common";
import { addRemovedInvertedItemToTracker } from "../../features/corruption/inventory/removedInvertedItems";
import {
  renderCorruptedCollectibleSpriteInActiveSlot,
  renderCorruptedCollectibleSpriteInPocketSlot,
} from "../../helper/deletedSpecific/funnySprites";
import { fprint } from "../../helper/printHelper";
import {
  renderCollectibleInActiveSlot,
  renderCollectibleInPocketSlot,
} from "../../helper/renderHelper";
import {
  isZazzinatorActive,
  isZazzinatorActiveCopy,
} from "../../sets/zazzSets";
import { Facet, initGenericFacet } from "../Facet";
import { InvertedActiveActionSet } from "../corruption/actionSets/Inverted/InvertedActiveActionSet";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  run: {
    activeSlot1: new Map<PlayerIndex, InvertedActiveActionSet | undefined>(),
    activeSlot2: new Map<PlayerIndex, InvertedActiveActionSet | undefined>(),
    pocketSlot: new Map<PlayerIndex, InvertedActiveActionSet | undefined>(),
    singleUsePocketSlot: new Map<
      PlayerIndex,
      InvertedActiveActionSet | undefined
    >(),
  },
};

/**
 * Corrupted Actives are basically custom active items that can have a unique sprite, effects,
 * charge, etc, modified during the game. To simulate this, we need to set up 'dummy' invisible
 * active items that don't have a name, for every possible charge setting. The sprite will then be
 * rendered on top. However, there are a few problems:
 *
 * 1 - Tracking the custom pocket item active is relatively simple, you can tell exactly what
 * PocketItem position it is in. The only problem occurs when you have the dice bag trinket.
 *
 * 2 - Tracking corrupted active items in ActiveSlot 1 and ActiveSlot 2 is more difficult, as there
 * is no way to tell which corrupted active is in which slot, if both have the same charge (and
 * hence the same dummy item). To solve this, we need to have two sets of dummy items, and if a
 * player has one from one set the next one should be from the other set.
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
    collectibleType: int,
  ): void {
    if (!isZazzinatorActive(collectibleType as CollectibleType)) {
      return;
    }

    const playerIndex = getPlayerIndex(player);
    const activeSlot1 = v.run.activeSlot1.get(playerIndex);
    const activeSlot2 = v.run.activeSlot2.get(playerIndex);
    const pocketSlot = v.run.pocketSlot.get(playerIndex);
    const hasSchoolbag = player.HasCollectible(CollectibleType.SCHOOLBAG);
    // const singleUsePocketSlot = v.run.singleUsePocketSlot.get(playerIndex);

    fprint(`

    ******* CustomActiveFacet.postPlayerCollectibleRemoved() *******
    PlayerIndex: ${playerIndex}`);

    if (
      pocketSlot !== undefined &&
      player.GetActiveItem(ActiveSlot.POCKET) === CollectibleType.NULL
    ) {
      fprint(
        ` Slot: pocketSlot
        Reference: ${pocketSlot.oi ?? CollectibleType.SAD_ONION}}`,
      );
      pocketSlot.removeFromPlayer(
        player,
        pocketSlot.oi as CollectibleType,
        false,
        true,
      );
      addRemovedInvertedItemToTracker(
        player,
        collectibleType as CollectibleType,
        (pocketSlot.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
      );
      v.run.pocketSlot.delete(playerIndex);
    }

    if (hasSchoolbag) {
      if (activeSlot2 !== undefined && activeSlot1 !== undefined) {
        /**
         * If the custom active in slot1 has been removed (e.g when a new active is picked up), and
         * the player had 2 custom actives, the physical active from slot2 will immediately move
         * down to slot1 after slot1 collectible is removed.
         */

        // There will be nothing in slot2 at this time.
        if (
          player.GetActiveItem(ActiveSlot.SECONDARY) === CollectibleType.NULL
        ) {
          const itemInSlot1 = player.GetActiveItem(ActiveSlot.PRIMARY);

          // Item in slot1 should be replica of slot2 custom active.
          if (isZazzinatorActive(itemInSlot1)) {
            // Check if the physical item from slot2 is now found in slot1.
            if (
              doesInvertedActiveActionSetMatchZazzActive(
                activeSlot2,
                itemInSlot1,
              )
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
                collectibleType as CollectibleType,
                (activeSlot1.oi ??
                  CollectibleType.SAD_ONION) as CollectibleType,
              );
              v.run.activeSlot1.set(playerIndex, activeSlot2);
              v.run.activeSlot2.delete(playerIndex);
            }
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
            collectibleType as CollectibleType,
            (activeSlot1.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
          );
          v.run.activeSlot1.delete(playerIndex);
        }
      }
    } else if (activeSlot1 !== undefined) {
      if (!isZazzinatorActive(player.GetActiveItem(ActiveSlot.PRIMARY))) {
        activeSlot1.removeFromPlayer(
          player,
          activeSlot1.oi as CollectibleType,
          false,
          true,
        );
        addRemovedInvertedItemToTracker(
          player,
          collectibleType as CollectibleType,
          (activeSlot1.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
        );
        v.run.activeSlot1.delete(playerIndex);
      }
    }

    // Unsubscribe if there are no more inverted actives.
    fprint(`Trying to unsubscribe from CustomActiveFacet...

    activeSlot1: ${v.run.activeSlot1.size},
    activeSlot2: ${v.run.activeSlot2.size},
    pocketSlot: ${v.run.pocketSlot.size},
    singleUsePocketSlot: ${v.run.singleUsePocketSlot.size}`);
    if (
      v.run.activeSlot1.size === 0 &&
      v.run.activeSlot2.size === 0 &&
      v.run.pocketSlot.size === 0 &&
      v.run.singleUsePocketSlot.size === 0
    ) {
      this.unsubscribeAll();
    }
  }

  /** When an inverted active is used, all the Responses are immediately triggered. */
  @Callback(ModCallback.POST_USE_ITEM)
  postUseItem(
    collectibleType: CollectibleType,
    rng: RNG,
    player: EntityPlayer,
    useFlags: BitFlags<UseFlag>,
    activeSlot: int,
    customVarData: int,
  ):
    | boolean
    | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
    | undefined {
    if (!isZazzinatorActive(collectibleType)) {
      return undefined;
    }

    /** Find which ActionSet is being used. */
    let actionSet: InvertedActiveActionSet | undefined;
    const playerIndex = getPlayerIndex(player);
    if ((activeSlot as ActiveSlot) === ActiveSlot.PRIMARY) {
      actionSet = v.run.activeSlot1.get(playerIndex);
    } else if ((activeSlot as ActiveSlot) === ActiveSlot.SECONDARY) {
      actionSet = v.run.activeSlot2.get(playerIndex);
    } else if ((activeSlot as ActiveSlot) === ActiveSlot.POCKET) {
      actionSet = v.run.pocketSlot.get(playerIndex);
    } else if ((activeSlot as ActiveSlot) === ActiveSlot.POCKET_SINGLE_USE) {
      actionSet = v.run.singleUsePocketSlot.get(playerIndex);
    }

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
   */
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    for (const player of getPlayers()) {
      const playerIndex = getPlayerIndex(player);

      let activeSlot1 = v.run.activeSlot1.get(playerIndex);
      let activeSlot2 = v.run.activeSlot2.get(playerIndex);
      const pocketSlot = v.run.pocketSlot.get(playerIndex);
      const singleUsePocketSlot = v.run.singleUsePocketSlot.get(playerIndex);

      /** Update the data if the player has switched active items. */

      // Swap the active slots.
      if (Input.IsActionTriggered(ButtonAction.DROP, player.ControllerIndex)) {
        if (activeSlot1 !== undefined) {
          if (
            doesInvertedActiveActionSetMatchZazzActive(
              activeSlot1,
              player.GetActiveItem(ActiveSlot.SECONDARY),
            )
          ) {
            fprint("Swapping activeSlot1 to activeSlot2...");
            v.run.activeSlot2.set(playerIndex, activeSlot1);
            if (activeSlot2 === undefined) {
              v.run.activeSlot1.delete(playerIndex);
            }
          }
        }
        if (activeSlot2 !== undefined) {
          if (
            doesInvertedActiveActionSetMatchZazzActive(
              activeSlot2,
              player.GetActiveItem(ActiveSlot.PRIMARY),
            )
          ) {
            fprint("Swapping activeSlot2 to activeSlot1...");
            v.run.activeSlot1.set(playerIndex, activeSlot2);
            if (activeSlot1 === undefined) {
              v.run.activeSlot2.delete(playerIndex);
            }
          }
        }
        activeSlot1 = v.run.activeSlot1.get(playerIndex);
        activeSlot2 = v.run.activeSlot2.get(playerIndex);
      }

      if (activeSlot1 !== undefined) {
        const icon = activeSlot1.getIcon();
        if (isColor(icon)) {
          const collectibleType = activeSlot1.oi ?? CollectibleType.SAD_ONION;
          renderCollectibleInActiveSlot(
            player,
            collectibleType as CollectibleType,
            ActiveSlot.PRIMARY,
            undefined,
            undefined,
            true,
          );
        } else {
          renderCorruptedCollectibleSpriteInActiveSlot(
            player,
            icon,
            ActiveSlot.PRIMARY,
          );
        }
      }

      if (activeSlot2 !== undefined) {
        const icon = activeSlot2.getIcon();
        if (isColor(icon)) {
          const collectibleType = activeSlot2.oi ?? CollectibleType.SAD_ONION;
          renderCollectibleInActiveSlot(
            player,
            collectibleType as CollectibleType,
            ActiveSlot.SECONDARY,
            undefined,
            undefined,
            true,
          );
        } else {
          renderCorruptedCollectibleSpriteInActiveSlot(
            player,
            icon,
            ActiveSlot.SECONDARY,
          );
        }
      }

      /** Pocket Item Rendering. */
      if (pocketSlot !== undefined) {
        const currentPocketSlot = getActivePocketItemSlot(player);
        if (currentPocketSlot !== undefined) {
          const icon = pocketSlot.getIcon();
          if (isColor(icon)) {
            const collectibleType = pocketSlot.oi ?? CollectibleType.SAD_ONION;
            renderCollectibleInPocketSlot(
              player,
              collectibleType as CollectibleType,
              currentPocketSlot,
              undefined,
              undefined,
              true,
            );
          } else {
            renderCorruptedCollectibleSpriteInPocketSlot(
              player,
              icon,
              currentPocketSlot,
            );
          }
        }
      }

      if (singleUsePocketSlot !== undefined) {
      }
    }
  }

  /** Edge case where normal active is added, push corrupted item in slot1 to slot2. */
  @CallbackCustom(ModCallbackCustom.POST_PLAYER_COLLECTIBLE_ADDED)
  postPlayerCollectibleAdded(
    player: EntityPlayer,
    collectibleType: CollectibleType,
  ): void {
    if (player.HasCollectible(CollectibleType.SCHOOLBAG)) {
      if (!isZazzinatorActive(collectibleType)) {
        const activeSlot1 = v.run.activeSlot1.get(getPlayerIndex(player));
        if (activeSlot1 !== undefined) {
          if (!isZazzinatorActive(player.GetActiveItem(ActiveSlot.PRIMARY))) {
            v.run.activeSlot2.set(getPlayerIndex(player), activeSlot1);
            v.run.activeSlot1.delete(getPlayerIndex(player));
          }
        }
      }
    }
  }
}

export function initHUDRenderingFacet(): void {
  FACET = initGenericFacet(CustomActiveFacet, v);
}

// eslint-disable-next-line no-underscore-dangle
export function _addInvertedActiveToPlayer(
  player: EntityPlayer,
  actionSet: InvertedActiveActionSet,
  slot:
    | ActiveSlot.PRIMARY
    | ActiveSlot.POCKET
    | ActiveSlot.POCKET_SINGLE_USE = ActiveSlot.PRIMARY,
): void {
  const playerIndex = getPlayerIndex(player);
  fprint(
    `Adding inverted active to player slot ${slot}, isCopy: ${
      actionSet.copy ?? false
    }, chargeType: ${actionSet.getChargeType()}, charges: ${actionSet.getCharges()}`,
  );
  switch (slot) {
    case ActiveSlot.PRIMARY:
      // eslint-disable-next-line no-case-declarations
      const hasSchoolbag = player.HasCollectible(CollectibleType.SCHOOLBAG);
      if (!hasSchoolbag) {
        v.run.activeSlot2.delete(getPlayerIndex(player));
        v.run.activeSlot1.set(getPlayerIndex(player), actionSet);
        break;
      } else if (hasOpenActiveItemSlot(player)) {
        v.run.activeSlot2.delete(getPlayerIndex(player));
        v.run.activeSlot1.set(getPlayerIndex(player), actionSet);
        break;
      }

      fprint("Player has schoolbag and no empty slots...");
      if (v.run.activeSlot1.has(playerIndex)) {
        fprint("_addInvertedActive: Pushing activeSlot1 to activeSlot2...");
        v.run.activeSlot2.set(playerIndex, v.run.activeSlot1.get(playerIndex));
      }
      v.run.activeSlot1.set(getPlayerIndex(player), actionSet);
      break;
    case ActiveSlot.POCKET:
      v.run.pocketSlot.set(getPlayerIndex(player), actionSet);
      break;
    case ActiveSlot.POCKET_SINGLE_USE:
      v.run.singleUsePocketSlot.set(getPlayerIndex(player), actionSet);
  }

  fprint(`Subscribing to Custom Active facet if not already...

  activeSlot1: ${v.run.activeSlot1.size},
  activeSlot2: ${v.run.activeSlot2.size},
  pocketSlot: ${v.run.pocketSlot.size},
  singleUsePocketSlot: ${v.run.singleUsePocketSlot.size}
  `);
  FACET?.subscribeIfNotAlready();
}

export function getCustomActiveData(): string {
  return `activeSlot1: ${v.run.activeSlot1.size},
  activeSlot2: ${v.run.activeSlot2.size},
  pocketSlot: ${v.run.pocketSlot.size},
  singleUsePocketSlot: ${v.run.singleUsePocketSlot.size}`;
}

/**
 * Checks if the InvertedActiveActionSet matches the Zazzinator dummy item by comparing the charge
 * type, charges, and whether or not it is a copy.
 */
function doesInvertedActiveActionSetMatchZazzActive(
  actionSet: InvertedActiveActionSet,
  zazzActive: CollectibleType,
): boolean {
  const chargeType = actionSet.getChargeType();
  const charges = actionSet.getCharges();
  const isCopy = actionSet.copy ?? false;

  if (isZazzinatorActiveCopy(zazzActive) !== isCopy) {
    return false;
  }

  if (charges !== getCollectibleMaxCharges(zazzActive)) {
    return false;
  }

  if (chargeType !== getCollectibleChargeType(zazzActive)) {
    return false;
  }

  return true;
}

// eslint-disable-next-line no-underscore-dangle
export function _getCustomActiveActiveSlot1(
  player: EntityPlayer,
): InvertedActiveActionSet | undefined {
  return v.run.activeSlot1.get(getPlayerIndex(player));
}

// eslint-disable-next-line no-underscore-dangle
export function _getCustomActiveActiveSlot2(
  player: EntityPlayer,
): InvertedActiveActionSet | undefined {
  return v.run.activeSlot2.get(getPlayerIndex(player));
}

// eslint-disable-next-line no-underscore-dangle
export function _getCustomActivePocketSlot(
  player: EntityPlayer,
): InvertedActiveActionSet | undefined {
  return v.run.pocketSlot.get(getPlayerIndex(player));
}

// eslint-disable-next-line no-underscore-dangle
export function _getCustomActiveSingleUsePocketSlot(
  player: EntityPlayer,
): InvertedActiveActionSet | undefined {
  return v.run.singleUsePocketSlot.get(getPlayerIndex(player));
}

export function getPlayerInvertedActive(
  player: EntityPlayer,
  slot: ActiveSlot = ActiveSlot.PRIMARY,
): CollectibleType | undefined {
  const playerIndex = getPlayerIndex(player);
  switch (slot) {
    case ActiveSlot.PRIMARY:
      return v.run.activeSlot1.get(playerIndex)?.oi;
    case ActiveSlot.SECONDARY:
      return v.run.activeSlot2.get(playerIndex)?.oi;
    case ActiveSlot.POCKET:
      return v.run.pocketSlot.get(playerIndex)?.oi;
    case ActiveSlot.POCKET_SINGLE_USE:
      return v.run.singleUsePocketSlot.get(playerIndex)?.oi;
  }
}
