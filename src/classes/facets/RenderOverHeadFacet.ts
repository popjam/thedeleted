import type { CollectibleType } from "isaac-typescript-definitions";
import {
  CollectibleSpriteLayer,
  PlayerItemAnimation,
} from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import {
  CallbackCustom,
  ModCallbackCustom,
  getEnumValues,
  getPlayerIndex,
} from "isaacscript-common";
import { PLAYER_PICKUP_ANIMATION_RENDER_OFFSET } from "../../constants/renderConstants";
import { getCollectibleSpriteFromCache } from "../../features/general/spriteCache";
import { renderCorruptedCollectibleSprite } from "../../helper/deletedSpecific/funnySprites";
import { fprint } from "../../helper/printHelper";
import { worldToRenderPosition } from "../../helper/renderHelper";
import { newSparkleSprite } from "../../helper/spriteHelper";
import type { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { Facet, initGenericFacet } from "../Facet";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    currentlyPickingUp: new Map<
      PlayerIndex,
      [CorruptedCollectibleSprite | CollectibleType, boolean, number]
    >(),
    sparkleSprite: new Map<PlayerIndex, Sprite>(),
  },
};

let FACET: Facet | undefined;
class RenderOverHeadFacet extends Facet {
  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRender(player: EntityPlayer, _renderOffset: Vector): void {
    const playerData = v.room.currentlyPickingUp.get(getPlayerIndex(player));
    if (playerData === undefined) {
      return;
    }

    const spriteToRender = playerData[0];
    const override = playerData[1];
    const speed = playerData[2];

    if (shouldRenderPickupSprite(player, override)) {
      renderSparkleAboveHead(player);
      for (let i = 1; i < speed; i++) {
        player.GetSprite().Update();
      }
      renderCollectibleAboveHead(player, spriteToRender);
    } else {
      fprint(
        `Unsubscribing from RenderOverHeadFacet for player ${getPlayerIndex(
          player,
        )} (Pickup animation is finished).`,
      );
      const playerIndex = getPlayerIndex(player);
      v.room.currentlyPickingUp.delete(playerIndex);
      v.room.sparkleSprite.delete(playerIndex);
      FACET?.unsubscribe();
    }
  }
}

export function initRenderOverHeadFacet(): void {
  FACET = initGenericFacet(RenderOverHeadFacet, v);
}

/** Play the 'Pickup' animation with a custom sprite of your choosing. */
export function playPickupAnimationWithCustomSprite(
  player: EntityPlayer,
  spriteToRender: CorruptedCollectibleSprite | CollectibleType,
  speed = 1,
  sparkle = true,
): void {
  /** Pickup animation. */
  player.PlayExtraAnimation(PlayerItemAnimation.PICKUP);

  /** Sparkle. */
  if (sparkle) {
    const sparkleSprite = newSparkleSprite();
    v.room.sparkleSprite.set(getPlayerIndex(player), sparkleSprite);
  }

  fprint(
    `Subscribed to RenderOverHeadFacet for player ${getPlayerIndex(
      player,
    )} (playPickupAnimationWithCustomSprite).`,
  );

  v.room.currentlyPickingUp.set(getPlayerIndex(player), [
    spriteToRender,
    false,
    speed,
  ]);
  FACET?.subscribe();
}

/** This function should be called in PRE_PICKUP_ITEM. */
export function overridePickupAnimationWithCustomSprite(
  player: EntityPlayer,
  spriteToRender: CorruptedCollectibleSprite | CollectibleType,
): void {
  fprint(
    `Subscribed to RenderOverHeadFacet for player ${getPlayerIndex(
      player,
    )} (overridePickupAnimationWithCustomSprite).`,
  );
  v.room.currentlyPickingUp.set(getPlayerIndex(player), [
    spriteToRender,
    true,
    1,
  ]);
  FACET?.subscribe();
}

/**
 * Renders the sprite above the players' head, in the same position where you'd find the sprite
 * during the 'Pickup' animation.
 *
 * @param player The player to render the sprite above.
 * @param spriteToRender The sprite to render.
 * @param addSparkle Whether to add a sparkle effect to the sprite. When calling this function the
 *                   sparkle effect may be already added (e.g for an invisible item), so set it to
 *                   false.
 */
function renderCollectibleAboveHead(
  player: EntityPlayer,
  spriteToRender: CorruptedCollectibleSprite | CollectibleType,
) {
  if (typeof spriteToRender === "number") {
    const newSprite = getCollectibleSpriteFromCache(spriteToRender);
    newSprite.Render(
      worldToRenderPosition(
        player.Position.add(PLAYER_PICKUP_ANIMATION_RENDER_OFFSET),
      ),
    );
  } else {
    renderCorruptedCollectibleSprite(
      worldToRenderPosition(
        player.Position.add(PLAYER_PICKUP_ANIMATION_RENDER_OFFSET),
      ),
      spriteToRender,
    );
  }
}

function renderSparkleAboveHead(player: EntityPlayer) {
  const sparkle = v.room.sparkleSprite.get(getPlayerIndex(player));
  if (sparkle !== undefined) {
    sparkle.Update();
    sparkle.RenderLayer(
      CollectibleSpriteLayer.SPARKLE,
      worldToRenderPosition(player.Position.add(Vector(0, -40))),
    );
  }
}

function shouldRenderPickupSprite(
  player: EntityPlayer,
  override: boolean,
): boolean {
  if (override) {
    if (player.IsItemQueueEmpty()) {
      return false;
    }
    return true;
  }

  const playerSprite = player.GetSprite();
  const animation = playerSprite.GetAnimation();

  /** Check if animation is in PlayerItemAnimation enum. */
  const pickupAnimations: string[] = getEnumValues(PlayerItemAnimation);
  if (!pickupAnimations.includes(animation)) {
    return false;
  }

  if (playerSprite.GetFrame() > 34) {
    return false;
  }

  return true;
}
