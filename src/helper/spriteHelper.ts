import type { EntityType, NPCID } from "isaac-typescript-definitions";
import type { EntityID } from "isaacscript-common";
import { copyColor, spawnEntityID } from "isaacscript-common";

/**
 * Copies a sprite into a new fresh sprite.
 *
 * @param oldSprite The sprite to copy.
 * @param play If false, will not play the animation the oldSprite is playing (default false).
 * @param copyData If true, will copy attributes from the old sprite such as Color, Scale, Frame,
 *                 etc (default true).
 */
export function copySprite(
  oldSprite: Sprite,
  play = false,
  copyData = true,
): Sprite {
  const nSprite = Sprite();
  nSprite.Load(oldSprite.GetFilename(), true);
  if (play) {
    nSprite.Play(oldSprite.GetAnimation(), true);
  }
  if (!copyData) {
    nSprite.Color = oldSprite.Color;
    nSprite.FlipX = oldSprite.FlipX;
    nSprite.FlipY = oldSprite.FlipY;
    nSprite.Scale = oldSprite.Scale;
    nSprite.Rotation = oldSprite.Rotation;
    nSprite.SetFrame(oldSprite.GetFrame());
  }
  return nSprite;
}

/** Generates a Sprite from the provided NPC. Does not play an animation. */
export function newNPCSprite(npc: NPCID): Sprite {
  const spawnedNPC = spawnEntityID(npc as EntityID, Vector(0, 0));
  spawnedNPC.Visible = false;
  const copiedSprite = copySprite(spawnedNPC.GetSprite());
  spawnedNPC.Remove();
  return copiedSprite;
}

/** Generates a Sprite from the provided EntityType. Does not play an animation. */
export function newEntitySprite(
  entityType: EntityType,
  entityVariant?: number,
  entitySubType?: number,
): Sprite {
  const spawnedEntity = Isaac.Spawn(
    entityType,
    entityVariant ?? 0,
    entitySubType ?? 0,
    Vector(0, 0),
    Vector(0, 0),
    undefined,
  );
  spawnedEntity.Visible = false;
  const copiedSprite = copySprite(spawnedEntity.GetSprite());
  spawnedEntity.Remove();
  return copiedSprite;
}

/** Generates a Sprite from the provided sprite filename. Does not play an animation. */
export function newSprite(filename: string): Sprite {
  const sprite = Sprite();
  sprite.Load(filename, true);
  return sprite;
}

/** Invert a sprites color. */
export function invertSpriteColors(sprite: Sprite): Sprite {
  const oldColor = sprite.Color;
  const newColor = copyColor(oldColor);
  newColor.SetColorize(1, 1, 1, 2);
  sprite.Color = newColor;
  return sprite;
}

/**
 * Create a Collectible Sprite set to 'PlayerPickupSparkle' with the correct playback speed. Needs
 * to be updated every render frame.
 */
export function newSparkleSprite(): Sprite {
  const sparkleSprite = newSprite("gfx/005.100_collectible.anm2");
  sparkleSprite.PlaybackSpeed = 0.5;
  sparkleSprite.Play("PlayerPickupSparkle", true);
  return sparkleSprite;
}

/**
 * Use this instead of the sprite.Render function if you want to clamp the sprite, while it is
 * flipped in the X and Y axis. Doing this with sprite.Render() will move the sprite in the opposite
 * direction.
 */
export function renderSprite(
  sprite: Sprite,
  position: Vector,
  topLeftClamp: Vector,
  bottomRightClamp: Vector,
): void {
  if (!sprite.FlipX && !sprite.FlipY) {
    sprite.Render(position, topLeftClamp, bottomRightClamp);
  } else if (sprite.FlipX && !sprite.FlipY) {
    sprite.Render(
      position.add(Vector(topLeftClamp.X - bottomRightClamp.X, 0)),
      bottomRightClamp,
      topLeftClamp,
    );
  } else if (!sprite.FlipX && sprite.FlipY) {
    sprite.Render(
      position.add(Vector(0, topLeftClamp.Y - bottomRightClamp.Y)),
      bottomRightClamp,
      topLeftClamp,
    );
  } else {
    sprite.Render(
      position.add(
        Vector(
          topLeftClamp.X - bottomRightClamp.X,
          topLeftClamp.Y - bottomRightClamp.Y,
        ),
      ),
      bottomRightClamp,
      topLeftClamp,
    );
  }
}

/**
 * Get the X and Y dimensions of a Sprite at it's current render frame. If the Sprite has multiple
 * layers, the largest dimensions will be returned.
 *
 * @param sprite The Sprite to get the dimensions of.
 * @param accountForScale If true, the Sprite's Scale will be accounted for (default true). For
 *                        example, if the Sprite is scaled to 2x, the returned dimensions will be
 *                        double the original dimensions.
 * @returns The X and Y dimensions of the Sprite (Vector X is width, Y is height).
 */
export function getSpriteSize(sprite: Sprite, accountForScale = true): Vector {
  const currentFrame = sprite.GetFrame();
  const currentAnimation = sprite.GetCurrentAnimationData();
  const animationLayers = currentAnimation.GetAllLayers();

  let width = 0;
  let height = 0;
  for (const layer of animationLayers) {
    const currentFrameData = layer.GetFrame(currentFrame);
    if (currentFrameData === undefined) {
      continue;
    }

    const frameWidth = currentFrameData.GetWidth();
    const frameHeight = currentFrameData.GetHeight();
    if (frameWidth > width) {
      width = frameWidth;
    }
    if (frameHeight > height) {
      height = frameHeight;
    }
  }

  // If accountForScale is true, multiply the width and height by the sprite's scale.
  if (accountForScale) {
    // Get the sprite's scale.
    const scale = sprite.Scale;

    width *= scale.X;
    height *= scale.Y;
  }

  return Vector(width, height);
}
