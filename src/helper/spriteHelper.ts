import { EntityType } from "isaac-typescript-definitions";
import { copyColor, EntityID, spawnEntityID } from "isaacscript-common";
import { NPCID } from "../enums/general/NPCID";

/** Copies a sprite into a new fresh sprite. Does not play an animation. */
export function copySprite(oldSprite: Sprite): Sprite {
  const nSprite = Sprite();
  nSprite.Load(oldSprite.GetFilename(), true);
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
