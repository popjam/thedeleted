import type {
  CardType,
  CollectibleType,
  DamageFlag,
  PillColor,
  PillEffect,
  UseFlag,
} from "isaac-typescript-definitions";
import type { Action } from "../../../classes/corruption/actions/Action";
import type { Response } from "../../../classes/corruption/responses/Response";
import type { PlayerStat } from "isaacscript-common";

/**
 * Data that you can provide when triggering an Action or Response. If you pass through triggerData
 * when triggering an Action, it will be passed through to the Response.
 */
export interface TriggerData {
  // If an Action has started the 'trigger' chain, this will contain that Action.
  action?: Action;
  // If the Response was triggered by a non-inverted pickup.
  nonInvertedPickup?: EntityPickup;
  // Responses that are triggered will be added to the end of this array.
  responses?: Response[];
  // If the Action / Response takes a player input.
  player?: EntityPlayer;
  // If the Action / Response takes an NPC input. Sometimes overrides player.
  onKillAction?: EntityNPC;
  // If the Action is onDamage.
  onDamageAction?: {
    damageFlags: BitFlags<DamageFlag>;
    source: EntityRef;
    amount: float;
    countdownFrames: int;
  };
  // If the player has corrupted bombs or onBombExplode Actions.
  onBombExplodedAction?: {
    bomb: EntityBomb;
  };

  // If the Action / Response would spawn an Entity, this is the position it should spawn at.
  spawnPosition?: Vector;

  // If the Action / Response would spawn an Entity, this is the velocity it should spawn with.
  spawnVelocity?: Vector;

  // If true, the SpawnGridEntity response should be triggered on the next frame. This will also
  // prevent it from returning any spawned grid entities.
  shouldSpawnGridEntityResponseDelay?: boolean;

  // If the Action is onDeath.
  onDeathAction?: {
    player: EntityPlayer;
  };

  // If the Action is onRevive.
  onReviveAction?: {
    player: EntityPlayer;
  };

  // If the Action is onPillUse.
  onPillUseAction?: {
    pillEffect: PillEffect;
    useFlags: BitFlags<UseFlag>;
  };

  // If the Action is onActiveUse.
  onActiveUseAction?: {
    player: EntityPlayer;
    active: CollectibleType;
  };

  // If the Action is onCardUse.
  onCardUseAction?: {
    player: EntityPlayer;
    card: CardType;
  };

  // If the Action is onBombExplode.
  onBombExplodeAction?: {
    bomb: EntityBomb;
  };

  // If the Action is onPickupCollect.
  onPickupCollectAction?: {
    player: EntityPlayer;
    pickup: EntityPickup;
  };

  // If the Action is onStat.
  onStatAction?: {
    player: EntityPlayer;
    stat: PlayerStat;
    difference: int;
  };

  onPurchaseAction?: {
    player: EntityPlayer;
    pickup: EntityPickup;
  };

  onSacrificeAction?: {
    player: EntityPlayer;
    numSacrifices: int;
  };

  onSlotUseAction?: {
    slot: Entity;
  };

  onSlotDestroyAction?: {
    slot: Entity;
  };
}
