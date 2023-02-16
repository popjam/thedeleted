import {
  CollectibleSpriteLayer,
  CollectibleType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  clearSprite,
  ColorDefault,
  getCollectibleGfxFilename,
  isGlitchedCollectible,
  PickupIndex,
  setCollectibleSprite,
} from "isaacscript-common";
import { renderCustomCollectibleSpriteOverCollectible } from "../../helper/deletedSpecific/funnySprites";
import { isCollectibleFree } from "../../helper/priceHelper";
import { fprint } from "../../helper/printHelper";
import { worldToRenderPosition } from "../../helper/renderHelper";
import { copySprite } from "../../helper/spriteHelper";
import { isGlitchedCollectibleSubType } from "../../helper/tmtrainerHelper";
import { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { mod } from "../../mod";
import { isZazzinatorAny } from "../../sets/zazzSets";
import { Facet, initGenericFacet } from "../Facet";

const v = {
  level: {
    replacedCollectibles: new Map<
      PickupIndex,
      [CollectibleType, CorruptedCollectibleSprite]
    >(),
  },
};

let FACET: Facet | undefined;
class CorruptedCollectibleSpriteFacet extends Facet {
  /** This is where we render the CorruptedCollectibleSprites. */
  @Callback(ModCallback.POST_PICKUP_RENDER, PickupVariant.COLLECTIBLE)
  postPickupRender(pickup: EntityPickup, _renderOffset: Vector): void {
    const corruptedCollectibleSprite = v.level.replacedCollectibles.get(
      mod.getPickupIndex(pickup),
    );

    /** If the pedestal is not subscribed. */
    if (corruptedCollectibleSprite === undefined) {
      return;
    }

    const collectibleType = corruptedCollectibleSprite[0];
    const sprite = corruptedCollectibleSprite[1];

    /** If the pedestal has been changed. */
    if ((pickup.SubType as CollectibleType) !== collectibleType) {
      fprint(
        `The pedestal: ${pickup.SubType} does not match the original request: ${collectibleType}`,
      );
      v.level.replacedCollectibles.delete(mod.getPickupIndex(pickup));
      // returnCorruptedCollectibleSpriteToNormal( pickup as EntityPickupCollectible, );
      if (isGlitchedCollectibleSubType(collectibleType)) {
        fprint("Removing Corrupted Collectible Sprite! (TMTRAINER)");
        pickup.GetSprite().Color = ColorDefault;
      }
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
    renderCustomCollectibleSpriteOverCollectible(
      pickup as EntityPickupCollectible,
      sprite,
    );
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
  collectible: EntityPickupCollectible,
  sprite: CorruptedCollectibleSprite,
): void {
  const pickupIndex = mod.getPickupIndex(collectible);
  const pickupAlreadyHasCorruptedSprite =
    v.level.replacedCollectibles.has(pickupIndex);

  v.level.replacedCollectibles.set(mod.getPickupIndex(collectible), [
    collectible.SubType,
    sprite,
  ]);
  fprint(
    `Replacing Collectible of Sub-Type ${collectible.SubType} Sprite with Corrupted!`,
  );

  /**
   * If the pedestal is a TMTRAINER item, additional measures need to be taken as once a TMTRAINER
   * sprite is cleared it can not be retrieved. Otherwise, just clear the sprite.
   */
  if (isGlitchedCollectible(collectible)) {
    collectible.GetSprite().Color = Color(0, 0, 0, 0);
  } else {
    clearSprite(collectible.GetSprite(), CollectibleSpriteLayer.HEAD);
  }

  /**
   * If the pickup already has a corrupted sprite and we are updating the design, there is no need
   * to subscribe again. However, if this is the first time corrupting the sprite, we need to.
   */
  if (!pickupAlreadyHasCorruptedSprite) {
    FACET?.subscribe();
  }
}

/**
 * Returns a Corrupted Collectible sprite created from replaceCollectibleSpriteWithCorrupted() to
 * its normal sprite, if it exists.
 */
export function returnCorruptedCollectibleSpriteToNormal(
  collectible: EntityPickupCollectible,
): void {
  const corruptedCollectibleData = v.level.replacedCollectibles.get(
    mod.getPickupIndex(collectible),
  );
  if (corruptedCollectibleData === undefined) {
    fprint("Tried to return a non-corrupted collectible to normal but failed!");
    return;
  }

  const collectibleType = corruptedCollectibleData[0];
  v.level.replacedCollectibles.delete(mod.getPickupIndex(collectible));

  if (isZazzinatorAny(collectible.SubType)) {
    fprint("Removing Corrupted Collectible Sprite! (Zazzinator)");
    return;
  }

  /** If the pedestal is null, no need to do anything. */
  fprint(`Pedestal Sub-Type at time of removal: ${collectible.SubType}`);
  if (collectible.SubType === CollectibleType.NULL) {
    fprint("Removing Corrupted Collectible Sprite! (Null)");
    collectible.GetSprite().Color = ColorDefault;
    return;
  }

  /** If the pedestal is a TMTRAINER item, we need to make it visible again. */
  if (isGlitchedCollectible(collectible)) {
    fprint("Removing Corrupted Collectible Sprite! (TMTRAINER)");
    collectible.GetSprite().Color = ColorDefault;
  } else {
    /** Otherwise, just set the sprite to the normal sprite. */
    fprint("Removing Corrupted Collectible Sprite! (Changed Sub-Type)");
    collectible.GetSprite().Color = ColorDefault;
    setCollectibleSprite(
      collectible,
      getCollectibleGfxFilename(collectibleType),
    );
  }

  FACET?.unsubscribe();
}
