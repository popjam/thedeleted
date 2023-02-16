import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  getPlayerIndex,
  newCollectibleSprite,
  PlayerIndex,
} from "isaacscript-common";
import { PLAYER_PICKUP_ANIMATION_RENDER_OFFSET } from "../../constants/renderConstants";
import { renderCustomCollectibleSprite } from "../../helper/deletedSpecific/funnySprites";
import { fprint } from "../../helper/printHelper";
import { worldToRenderPosition } from "../../helper/renderHelper";
import { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { Facet, initGenericFacet } from "../Facet";

const SPARKLE_LAYER = "Sparkle";

const v = {
  room: {
    currentlyPickingUp: new Map<
      PlayerIndex,
      [CorruptedCollectibleSprite | CollectibleType, boolean]
    >(),
  },
};

let FACET: Facet | undefined;
class RenderOverHeadFacet extends Facet {
  @Callback(ModCallback.POST_PLAYER_RENDER)
  postPlayerRender(player: EntityPlayer, _renderOffset: Vector): void {
    const playerData = v.room.currentlyPickingUp.get(getPlayerIndex(player));
    if (playerData === undefined) {
      return;
    }

    const spriteToRender = playerData[0];
    const override = playerData[1];

    if (override) {
      /** Only render if the Item Queue has something in it. */
      if (!player.IsItemQueueEmpty()) {
        renderAboveHead(player, spriteToRender);
      } else {
        fprint(
          `Unsubscribing from RenderOverHeadFacet for player ${getPlayerIndex(
            player,
          )} (Item Queue is empty).`,
        );
        v.room.currentlyPickingUp.delete(getPlayerIndex(player));
        FACET?.unsubscribe();
      }
    } else {
      const playerSprite = player.GetSprite();
      const animation = playerSprite.GetAnimation();
      if (animation === "Pickup") {
        renderAboveHead(player, spriteToRender);
      } else {
        fprint(
          `Unsubscribing from RenderOverHeadFacet for player ${getPlayerIndex(
            player,
          )} (Animation is not 'Pickup').`,
        );
        v.room.currentlyPickingUp.delete(getPlayerIndex(player));
        FACET?.unsubscribe();
      }
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
): void {
  player.PlayExtraAnimation("Pickup");
  fprint(
    `Subscribed to RenderOverHeadFacet for player ${getPlayerIndex(
      player,
    )} (playPickupAnimationWithCustomSprite).`,
  );

  v.room.currentlyPickingUp.set(getPlayerIndex(player), [
    spriteToRender,
    false,
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
  v.room.currentlyPickingUp.set(getPlayerIndex(player), [spriteToRender, true]);
  FACET?.subscribe();
}

/**
 * Renders the sprite above the players' head, in the same position where you'd find the sprite
 * during the 'Pickup' animation.
 * TODO: Add Sparkle.
 */
function renderAboveHead(
  player: EntityPlayer,
  spriteToRender: CorruptedCollectibleSprite | CollectibleType,
) {
  if (typeof spriteToRender === "number") {
    const newSprite = newCollectibleSprite(spriteToRender);
    newSprite.Render(
      worldToRenderPosition(player.Position.add(Vector(0, -20))),
    );
  } else {
    renderCustomCollectibleSprite(
      worldToRenderPosition(
        player.Position.add(PLAYER_PICKUP_ANIMATION_RENDER_OFFSET),
      ),
      spriteToRender,
    );
  }
}
