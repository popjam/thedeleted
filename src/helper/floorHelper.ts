import { EffectVariant, SortingLayer } from "isaac-typescript-definitions";
import {
  VectorOne,
  VectorZero,
  copyColor,
  spawnEffect,
} from "isaacscript-common";
import { CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE } from "../constants/corruptionConstants";
import {
  FILL_SPRITE_TO_SCREEN_VECTOR_SCALE,
  WHITE_CLEAR_SPRITE_PNG_PATH,
} from "../constants/spriteConstants";

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
 * @param sprite - The Sprite to copy. If a string PNG is provided, will just replace the ladders
 *               spritesheet with that PNG. If undefined, will create an empty Sprite.
 * @param position - World position you want to render at.
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
 * be reset upon exiting the room or the game.
 */
export function setFloorColor(color: Color): Entity {
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
  const copiedColor = copyColor(color);

  /** Make the color barely visible. */
  copiedColor.A = CORRUPTED_BACKDROP_COLOR_TRANSPARENCY_VALUE;
  sprite.Color = copiedColor;
  sprite.Scale = FILL_SPRITE_TO_SCREEN_VECTOR_SCALE;
  return entity;
}
