import { EffectVariant, SortingLayer } from "isaac-typescript-definitions";
import { VectorOne, VectorZero, spawnEffect } from "isaacscript-common";
import { CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE } from "../constants/corruptionConstants";
import {
  FILL_SPRITE_TO_SCREEN_VECTOR_SCALE,
  WHITE_CLEAR_SPRITE_PNG_PATH,
} from "../constants/spriteConstants";
import type { AdvancedColor } from "../interfaces/general/AdvancedColor";
import { simplifyAndCopyColor, simplifyColor } from "./advancedColorHelper";

/**
 * Spawns a ladder with its sorting layer set to 'Background'. This is used to render things on the
 * floor.
 */
export function spawnFloorEntity(position: Vector = VectorOne): EntityEffect {
  const floorEntity = spawnEffect(EffectVariant.LADDER, 0, position);
  floorEntity.SortingLayer = SortingLayer.BACKGROUND;
  return floorEntity;
}

/**
 * Will copy the provided Sprite to a floor Sprite. This floor sprite will belong to a 'ladder'
 * entity which lasts the duration of the room. Does not copy a Sprite's replaced spritesheets, you
 * will have to do that yourself with the returned Sprite object. The floor sprite will exist until
 * the player leaves the room or the game.
 *
 * @param sprite The Sprite to copy. If a string PNG is provided, will just replace the ladders
 *               spritesheet with that PNG. If undefined, will create an empty Sprite.
 * @param position World position you want to render at.
 * @returns An object containing the floor sprite and entity.
 */
export function copySpriteToFloor(
  sprite: Sprite | string | undefined = undefined,
  position: Vector = VectorZero,
): {
  sprite: Sprite;
  entity: EntityEffect;
} {
  /** The floor entity which we will replace our sprite with. */
  const floorEntity = spawnFloorEntity(position);
  const floorSprite = floorEntity.GetSprite();

  if (typeof sprite === "string") {
    floorSprite.ReplaceSpritesheet(0, sprite);
    floorSprite.LoadGraphics();
  } else if (sprite !== undefined) {
    floorSprite.Color = sprite.Color;
    floorSprite.FlipX = sprite.FlipX;
    floorSprite.FlipY = sprite.FlipY;
    floorSprite.Scale = sprite.Scale;
    floorSprite.Rotation = sprite.Rotation;
    floorSprite.Load(sprite.GetFilename(), false);
    floorSprite.Play(sprite.GetAnimation(), true);
    floorSprite.SetFrame(sprite.GetFrame());
    floorSprite.LoadGraphics();
  }

  return { sprite: floorSprite, entity: floorEntity };
}

/**
 * Sets the floor color, by rendering a white sprite on the floor layer. This is better than the
 * setFloorColor() function from the Room class as it actually does something. The floor color will
 * be reset upon exiting the room or the game. Use 'setFloorColor()' to permanently change the floor
 * color. Note: Will only deep copy the color if override transparency is set to true.
 *
 * @param color The color to set the floor to, can be an AdvancedColor or Color.
 * @param overrideTransparencyAndDeepCopy If true, will override the transparency of the color to
 *                                 make it barely visible with the default value.
 * @returns The floor EntityEffect used to color the floor. Disappears upon leaving the room or the
 *          game.
 */
export function setTemporaryFloorColor(
  color: Color | AdvancedColor,
  overrideTransparencyAndDeepCopy = true,
): EntityEffect {
  /**
   * We use a white sprite then color it using its .Color variable. We also need to size it up to
   * fill the screen.
   */
  const spriteAndEntity = copySpriteToFloor(
    WHITE_CLEAR_SPRITE_PNG_PATH,
    VectorZero,
  );
  const { sprite } = spriteAndEntity;
  const { entity } = spriteAndEntity;

  /** Make the color barely visible. */
  if (overrideTransparencyAndDeepCopy) {
    color = simplifyAndCopyColor(color);
    color.A = CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE;
  } else {
    color = simplifyColor(color);
  }
  sprite.Color = color;
  sprite.Scale = FILL_SPRITE_TO_SCREEN_VECTOR_SCALE;
  return entity;
}
