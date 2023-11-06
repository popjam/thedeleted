import {
  CollectibleSpriteLayer,
  CollectibleType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import type { PickupIndex } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  ColorDefault,
  ModCallbackCustom,
  clearSprite,
  getCollectibleGfxFilename,
  getTSTLClassName,
  isCollectible,
  isGlitchedCollectible,
  setCollectibleSprite,
} from "isaacscript-common";
import { renderCorruptedCollectibleSpriteOverCollectible } from "../../helper/deletedSpecific/funnySprites";
import { getEntityIDFromEntity } from "../../helper/entityHelper";
import { isCollectibleFree } from "../../helper/priceHelper";
import { fprint } from "../../helper/printHelper";
import { worldToRenderPosition } from "../../helper/renderHelper";
import { copySprite } from "../../helper/spriteHelper";
import type { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { mod } from "../../mod";
import { isZazzinatorAny } from "../../sets/zazzSets";
import { Facet, initGenericFacet } from "../Facet";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  level: {
    replacedPickups: new Map<PickupIndex, CorruptedCollectibleSprite>(),
  },
};

/**
 * This Facet facilitates the rendering of custom 'TMTRAINER'-esque sprites on pedestals, that are
 * represented by the object CorruptedCollectibleSprite. To use this Facet, simply call
 * replaceCollectibleSpriteWithCorrupted() with the desired sprite and pedestal. Then when you no
 * longer want to render the sprite, call returnCorruptedCollectibleSpriteToNormal(). The sprite
 * will be removed upon picking up or rerolling the item.
 *
 * This will handle TMTRAINER sprites, handle leaving the room, leaving the run, diplopia, and other
 * edge cases.
 */
let FACET: Facet | undefined;
class CorruptedCollectibleSpriteFacet extends Facet {
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_CHANGED)
  postPickupChanged(
    pickup: EntityPickup,
    _oldVariant: PickupVariant,
    _oldSubType: number,
    _newVariant: PickupVariant,
    newSubType: number,
  ): void {
    fprint(
      `CorruptedCollectibleSpriteFacet: ${mod["getPickupIndex"](
        pickup,
      )} changed, unsubscribing.`,
    );
    if ((newSubType as CollectibleType) === CollectibleType.NULL) {
      returnCorruptedCollectibleSpriteToNormal(
        pickup as EntityPickupCollectible,
      );
    }
  }

  /** This is where we render the CorruptedCollectibleSprites. */
  @Callback(ModCallback.POST_PICKUP_RENDER, PickupVariant.COLLECTIBLE)
  postPickupRender(pickup: EntityPickup, _renderOffset: Vector): void {
    const corruptedSprite = v.level.replacedPickups.get(
      mod["getPickupIndex"](pickup),
    );

    /** If the pickup is not subscribed. */
    if (corruptedSprite === undefined) {
      return;
    }
    if (
      isGlitchedCollectible(pickup) &&
      isCollectibleFree(pickup as EntityPickupCollectible)
    ) {
      const newSprite = copySprite(pickup.GetSprite());
      newSprite.Color = ColorDefault;
      newSprite.Play("Alternates", true);
      newSprite.Render(worldToRenderPosition(pickup.Position));
    }

    /** Render the new sprite. */
    renderCorruptedCollectibleSpriteOverCollectible(
      pickup as EntityPickupCollectible,
      corruptedSprite,
    );
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

export function initCorruptedCollectibleSpriteFacet(): void {
  FACET = initGenericFacet(CorruptedCollectibleSpriteFacet, v);
}

/**
 * This function will remove a pedestal's item sprite, instead replacing it with the sprite
 * described by the specified CorruptedCollectibleSprite. A random seed is necessary as the
 * CorruptedCollectibleSprite requires randomness, leave it blank to generate a random seed.
 *
 * This will handle leaving the room, exiting the game, duplicating the pedestal, rerolling the
 * pedestal, and other edge cases.
 *
 * To return the sprite to normal, call returnCollectibleSpriteToNormal().
 */
export function replaceCollectibleSpriteWithCorrupted(
  pickup: EntityPickupCollectible,
  sprite: CorruptedCollectibleSprite,
): void {
  const pickupIndex = mod["getPickupIndex"](pickup);

  /**
   * If the pickup is a TMTRAINER collectible or non-trinket non-collectible pickup, we need to set
   * the sprite to be invisible, as once the sprite is removed there is no way to get it back. With
   * trinkets and standard collectibles, we can just remove the sprites as there is a way to
   * generate new sprites.
   */
  if (isCollectible(pickup)) {
    if (pickup.SubType === CollectibleType.NULL) {
      fprint("Cannot Remove Corrupted Collectible Sprite! (Null)");
      return;
    }
    if (isZazzinatorAny(pickup.SubType)) {
      fprint("Cannot Remove Corrupted Collectible Sprite! (Zazzinator)");
      return;
    }
    if (isGlitchedCollectible(pickup)) {
      pickup.GetSprite().Color = Color(0, 0, 0, 0);
    } else {
      clearSprite(pickup.GetSprite(), CollectibleSpriteLayer.HEAD);
    }
  }

  /** Save. */
  const pickupAlreadyHasCorruptedSprite =
    v.level.replacedPickups.has(pickupIndex);

  v.level.replacedPickups.set(mod["getPickupIndex"](pickup), sprite);
  fprint(
    `Replacing item ${getEntityIDFromEntity(pickup)}'s sprite with Corrupted!`,
  );

  /**
   * If the pickup already has a corrupted sprite and we are updating the design, there is no need
   * to subscribe again. However, if this is the first time corrupting the sprite, we need to.
   */
  if (!pickupAlreadyHasCorruptedSprite) {
    FACET?.subscribe();
  }
}

/**
 * Returns a Corrupted Collectible sprite created from replacePickupSpriteWithCorrupted() to its
 * normal sprite, if it exists. We need to allow non-Collectible pickups to be passed in because a
 * Corrupted Collectible can be transformed into a non-Collectible pickup.
 */
export function returnCorruptedCollectibleSpriteToNormal(
  pickup: EntityPickup,
): void {
  const corruptedCollectibleSprite = v.level.replacedPickups.get(
    mod["getPickupIndex"](pickup),
  );
  if (corruptedCollectibleSprite === undefined) {
    fprint("Tried to return a non-corrupted collectible to normal but failed!");
    return;
  }
  fprint(
    `Returning pickup ${pickup.SubType} to normal! (Corrupted Collectible Sprite)`,
  );

  v.level.replacedPickups.delete(mod["getPickupIndex"](pickup));

  if (isCollectible(pickup)) {
    /** Should not t */
    // if (isZazzinatorAny(pickup.SubType)) { fprint("Removing Corrupted Collectible Sprite!
    // (Zazzinator)"); return; }

    if (isGlitchedCollectible(pickup)) {
      pickup.GetSprite().Color = ColorDefault;
    } else {
      setCollectibleSprite(pickup, getCollectibleGfxFilename(pickup.SubType));
    }
  }

  FACET?.unsubscribe();
}
