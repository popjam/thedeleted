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
    // const singleUsePocketSlot = v.run.singleUsePocketSlot.get(playerIndex);

    if (
      pocketSlot !== undefined &&
      player.GetActiveItem(ActiveSlot.POCKET) === CollectibleType.NULL
    ) {
      fprint(
        "Pocket slot inverted item was removed, updating HUDRenderingFacet...",
      );
      addRemovedInvertedItemToTracker(
        player,
        collectibleType as CollectibleType,
        (pocketSlot.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
      );
      v.run.pocketSlot.set(playerIndex, undefined);
    }

    if (
      activeSlot1 !== undefined &&
      player.GetActiveItem(ActiveSlot.PRIMARY) === CollectibleType.NULL
    ) {
      fprint(
        `Active slot inverted item with chargeType: ${activeSlot1.getChargeType()}, charge: ${activeSlot1.getCharges()}, isCopy: ${
          activeSlot1.copy ?? false
        } was removed from activeSlot1, updating HUDRenderingFacet...`,
      );
      addRemovedInvertedItemToTracker(
        player,
        collectibleType as CollectibleType,
        (activeSlot1.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
      );
      v.run.activeSlot1.set(playerIndex, undefined);
    }

    if (activeSlot2 !== undefined) {
      if (player.GetActiveItem(ActiveSlot.SECONDARY) === CollectibleType.NULL) {
        fprint(
          `Active slot inverted item with chargeType: ${activeSlot2.getChargeType()}, charge: ${activeSlot2.getCharges()}, isCopy: ${
            activeSlot2.copy ?? false
          } was removed from activeSlot2, updating HUDRenderingFacet...`,
        );
        addRemovedInvertedItemToTracker(
          player,
          collectibleType as CollectibleType,
          (activeSlot2.oi ?? CollectibleType.SAD_ONION) as CollectibleType,
        );
        v.run.activeSlot2.set(playerIndex, undefined);

        /**
         * If the item in item slot 2 has moved to slot 1 due to the item in slot 1 being removed.
         */
        const itemInSlot1 = player.GetActiveItem(ActiveSlot.PRIMARY);
        if (itemInSlot1 !== CollectibleType.NULL) {
          if (
            doesInvertedActiveActionSetMatchZazzActive(activeSlot2, itemInSlot1)
          ) {
            fprint(
              `Inverted Active Item with chargeType: ${activeSlot2.getChargeType()}, charge: ${activeSlot2.getCharges()}, isCopy: ${
                activeSlot2.copy ?? false
              } in Slot 2 has moved to Slot 1, updating HUDRenderingFacet...`,
            );
            v.run.activeSlot1.set(playerIndex, activeSlot2);
          }
        }
      }
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
      if (activeSlot1 !== undefined && activeSlot2 !== undefined) {
        if (
          Input.IsActionTriggered(ButtonAction.DROP, player.ControllerIndex)
        ) {
          // Swap the active slots.
          fprint("Swapping inverted active slots...");
          v.run.activeSlot1.set(playerIndex, activeSlot2);
          v.run.activeSlot2.set(playerIndex, activeSlot1);
          [activeSlot1, activeSlot2] = [activeSlot2, activeSlot1];
        }
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
  fprint(
    `Adding inverted active to player slot ${slot}, isCopy: ${
      actionSet.copy ?? false
    }, chargeType: ${actionSet.getChargeType()}, charges: ${actionSet.getCharges()}`,
  );
  switch (slot) {
    case ActiveSlot.PRIMARY:
      // eslint-disable-next-line no-case-declarations
      const hasSchoolbag = player.HasCollectible(CollectibleType.SCHOOLBAG);
      if (!hasSchoolbag || hasOpenActiveItemSlot(player)) {
        v.run.activeSlot2.set(getPlayerIndex(player), undefined);
        v.run.activeSlot1.set(getPlayerIndex(player), actionSet);
        break;
      }

      // If they have schoolbag and no empty slots...
      v.run.activeSlot2.set(
        getPlayerIndex(player),
        v.run.activeSlot1.get(getPlayerIndex(player)),
      );
      v.run.activeSlot1.set(getPlayerIndex(player), actionSet);
      break;
    case ActiveSlot.POCKET:
      v.run.pocketSlot.set(getPlayerIndex(player), actionSet);
      break;
    case ActiveSlot.POCKET_SINGLE_USE:
      v.run.singleUsePocketSlot.set(getPlayerIndex(player), actionSet);
  }

  FACET?.subscribe();
}

/** Determines if the physical Zazz Active added to ActiveSlot.PRIMARY should be a copy or not. */
export function shouldZazzActiveBeACopy(player: EntityPlayer): boolean {
  const playerIndex = getPlayerIndex(player);
  const activeSlot1 = v.run.activeSlot1.get(playerIndex);
  const activeSlot2 = v.run.activeSlot2.get(playerIndex);
  const hasSchoolbag = player.HasCollectible(CollectibleType.SCHOOLBAG);

  if (activeSlot1 === undefined || !hasSchoolbag) {
    return false;
  }

  // From this point on, has schoolbag and activeSlot1 is defined.
  if (activeSlot2 === undefined) {
    return !(activeSlot1.copy ?? true);
  }

  // Both slots full.
  return !(activeSlot2.copy ?? true);
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
