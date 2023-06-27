import { ModCallback } from "isaac-typescript-definitions";
import {
  COLORS,
  Callback,
  colorEquals,
  game,
  getNPCs,
  getRandomSeed,
} from "isaacscript-common";
import { NPCID } from "../../../../enums/general/ID/NPCID";
import { getEntityIDFromEntity } from "../../../../helper/entityHelper";
import { getNPCFamily } from "../../../../helper/npcHelper";
import { fprint } from "../../../../helper/printHelper";
import { worldToRenderPosition } from "../../../../helper/renderHelper";
import { newNPCSprite } from "../../../../helper/spriteHelper";
import { Facet, initGenericFacet } from "../../../Facet";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    censoredNPCs: new Map<PtrHash, Sprite>(),
  },
};

let FACET: Facet | undefined;
class CensoredNPCFacet extends Facet {
  @Callback(ModCallback.POST_PROJECTILE_RENDER)
  postProjectileRender(
    projectile: EntityProjectile,
    renderOffset: Vector,
  ): void {
    if (projectile.SpawnerEntity === undefined) {
      return;
    }

    const parentPtrHash = GetPtrHash(projectile.SpawnerEntity);
    if (v.room.censoredNPCs.has(parentPtrHash)) {
      projectile.SetColor(COLORS.Black, 0, 1);
    }
  }

  @Callback(ModCallback.POST_NPC_RENDER)
  postNPCUpdate(npc: EntityNPC): void {
    const sprite = v.room.censoredNPCs.get(GetPtrHash(npc));
    if (sprite === undefined) {
      return;
    }

    if (sprite.IsFinished(sprite.GetAnimation())) {
      sprite.PlayRandom(getRandomSeed());
    }
    // Only update if frame count is even.
    if (game.GetFrameCount() % 2 === 0) {
      sprite.Update();
    }

    // Check if enemy is hurt, and update sprite color.
    if (!colorEquals(npc.GetColor(), COLORS.Black)) {
      sprite.Color = npc.GetColor();
    } else {
      sprite.Color = COLORS.Black;
    }

    sprite.Render(worldToRenderPosition(npc.Position));
  }
}

export function initCensoredNPCFacet(): void {
  FACET = initGenericFacet(CensoredNPCFacet, v);
}

export function censorNPC(npc: EntityNPC): void {
  const npcFamily = getNPCFamily(npc);
  npcFamily.forEach((member) => {
    if (v.room.censoredNPCs.has(GetPtrHash(member))) {
      return;
    }
    const copiedSprite = newNPCSprite(getEntityIDFromEntity(npc) as NPCID);
    copiedSprite.PlayRandom(getRandomSeed());
    copiedSprite.Color = COLORS.Black;
    v.room.censoredNPCs.set(GetPtrHash(member), copiedSprite);

    npc.SetColor(COLORS.Black, 0, 1);
    fprint(`Censoring NPC: ${member.Type} (${member.Variant})`);
    FACET?.subscribe();
  });
}

export function censorAllNPCsInRoom(): void {
  getNPCs().forEach((npc) => {
    censorNPC(npc);
  });
}
