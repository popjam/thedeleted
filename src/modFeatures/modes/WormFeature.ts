import {
  EntityFlag,
  EntityType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  arrayToBitFlags,
  Callback,
  CallbackCustom,
  copyColor,
  getPlayerFromIndex,
  getPlayerIndex,
  ModCallbackCustom,
  PlayerIndex,
  spawnNPC,
} from "isaacscript-common";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { fprint } from "../../helper/printHelper";
import { CustomModFeature } from "../CustomModFeature";

export interface WormFeatureInput {
  playerIndex: PlayerIndex;
}

export interface WormFeatureInstance {
  player: PlayerIndex;
  wormData: WormData;
}

enum WormLevel {
  LEVEL_ONE,
  LEVEL_TWO,
}

interface WormData {
  lv: WormLevel;
}

const POST_REMOVAL_SFX = SoundEffect.BOSS_2_INTRO_ERROR_BUZZ;

/**
 * This feature gives a player a pet Worm. Pet worms all start on a base form, and evolve every
 * floor. Once a worm has died, it dies permanently.
 *
 * Worms evolution tree branches out into different lines of evolution, that can be influenced by
 * things the owner does on the floor.
 *
 * Every worm evolution stage is better than the last (usually).
 *
 * LONG WORM: Base worm -> Long worm -> Longer worm -> Even longer worm -> Longest worm.
 */
export class WormFeature extends CustomModFeature<WormFeatureInstance> {
  override v = {
    run: {
      subscribers: new Map<number, WormFeatureInstance>([]),
      ids: 0,
    },
  };

  /**
   * This feature gives a player a pet Worm. Pet worms all start on a base form, and evolve every
   * floor. Once a worm has died, it dies permanently.
   *
   * Worms evolution tree branches out into different lines of evolution, that can be influenced by
   * things the owner does on the floor.
   *
   * Every worm evolution stage is better than the last (usually).
   *
   * LONG WORM: Base worm -> Long worm -> Longer worm -> Even longer worm -> Longest worm.
   */
  override subscribe(player: EntityPlayer): number {
    return this.subscribeWithInput({
      playerIndex: getPlayerIndex(player),
    });
  }

  override subscribeWithInput(input: WormFeatureInput): number {
    fprint("Subscribing to MORRISFeature!");

    // Generate worm.
    const wormData = this.birthWorm(input);

    return this.addInstance({ player: input.playerIndex, wormData });
  }

  override unsubscribe(id: number): void {
    fprint("Unsubscribing from MORRISFeature!");

    this.removeInstance(id);
  }

  birthWorm(input: WormFeatureInput): WormData {
    const player = getPlayerFromIndex(input.playerIndex) ?? Isaac.GetPlayer();
    this.spawnLevelOneWorm(player.Position);
    return { lv: WormLevel.LEVEL_ONE };
  }

  spawnLevelOneWorm(position: Vector): EntityNPC {
    const startingWorm = spawnNPC(EntityType.SMALL_MAGGOT, 0, 0, position);
    startingWorm.AddEntityFlags(
      arrayToBitFlags([EntityFlag.FRIENDLY, EntityFlag.PERSISTENT]),
    );
    startingWorm.GetSprite().Color = copyColor(DeletedColor.WORM_TURQUOISE);
    startingWorm.GetSprite().LoadGraphics();
    return startingWorm;
  }

  // eslint-disable-next-line class-methods-use-this
  @Callback(ModCallback.POST_NEW_ROOM)
  postNewRoom(): void {}

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {}

  @Callback(ModCallback.POST_NPC_DEATH, EntityType.SMALL_MAGGOT)
  postNPCDeath(npc: EntityNPC): void {}
}
