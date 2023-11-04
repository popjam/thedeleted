import { ModCallback } from "isaac-typescript-definitions";
import {
  COLORS,
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  colorEquals,
  game,
  getNPCs,
  getRandomSeed,
  getTSTLClassName,
} from "isaacscript-common";
import type { NPCID } from "../../../../enums/general/ID/NPCID";
import { getEntityIDFromEntity } from "../../../../helper/entityHelper";
import {
  getNPCFamily,
  getNPCLineage,
} from "../../../../helper/entityHelper/npcHelper";
import { fprint } from "../../../../helper/printHelper";
import { worldToRenderPosition } from "../../../../helper/renderHelper";
import { newNPCSprite } from "../../../../helper/spriteHelper";
import { Facet, initGenericFacet } from "../../../Facet";
import { getRandomRotation } from "../../../../helper/numbers/numberHelper";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    censoredNPCs: new Map<PtrHash, Sprite>(),
  },
};

let FACET: Facet | undefined;
class CensoredNPCFacet extends Facet {
  // Censor projectiles that are spawned from censored NPCs.
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

  // Censor NPCs that are spawned from censored NPCs.
  @Callback(ModCallback.POST_NPC_INIT)
  postNPCInit(npc: EntityNPC): void {
    const spawnerEntity = npc.SpawnerEntity;
    if (spawnerEntity === undefined) {
      return;
    }

    const spawnerPtrHash = GetPtrHash(spawnerEntity);
    if (!v.room.censoredNPCs.has(spawnerPtrHash)) {
      return;
    }

    // Censor the NPC that was spawned from a censored NPC.
    censorNPC(npc);
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
    sprite.Color = colorEquals(npc.GetColor(), COLORS.Black)
      ? COLORS.Black
      : npc.GetColor();
    npc.SetColor(COLORS.Black, 0, 999);

    sprite.Render(worldToRenderPosition(npc.Position));
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.unsubscribeAll();
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

export function initCensoredNPCFacet(): void {
  FACET = initGenericFacet(CensoredNPCFacet, v);
}

/**
 * This will censor the NPC, turning them and any of their produced entities black. It will also
 * make them play random animations, obfuscating them even further.
 */
export function censorNPC(npc: EntityNPC, individual = false): void {
  const npcFamily = individual ? new Set<EntityNPC>([npc]) : getNPCFamily(npc);
  for (const member of npcFamily) {
    if (v.room.censoredNPCs.has(GetPtrHash(member))) {
      continue;
    }
    const copiedSprite = newNPCSprite(getEntityIDFromEntity(member) as NPCID);
    copiedSprite.PlayRandom(getRandomSeed());
    copiedSprite.Color = COLORS.Black;
    v.room.censoredNPCs.set(GetPtrHash(member), copiedSprite);

    member.SetColor(COLORS.Black, 0, 1);
    fprint(`Censoring NPC: ${member.Type} (${member.Variant})`);
  }

  FACET?.subscribeIfNotAlready();
}

export function censorAllNPCsInRoom(): void {
  for (const npc of getNPCs()) {
    censorNPC(npc);
  }
}
