import { EntityType } from "isaac-typescript-definitions";
import { EntityID, copyColor, spawnEntityID } from "isaacscript-common";
import { NPCID } from "../enums/general/ID/NPCID";

/**
 * Copies a sprite into a new fresh sprite.
 *
 * @param oldSprite The sprite to copy.
 * @param play If true, will not play the animation the oldSprite is playing.
 * @param copyData If true, will copy attributes from the old sprite such as Color, Scale, Frame,
 *                 etc.
 */
export function copySprite(
  oldSprite: Sprite,
  play = true,
  copyData = true,
): Sprite {
  const nSprite = Sprite();
  nSprite.Load(oldSprite.GetFilename(), true);
  if (!play) {
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