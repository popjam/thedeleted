import { DamageFlag } from "isaac-typescript-definitions";
import { Action } from "../../../classes/corruption/actions/Action";
import { Response } from "../../../classes/corruption/responses/Response";

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
}
