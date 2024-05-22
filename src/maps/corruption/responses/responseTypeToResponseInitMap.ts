import { GetCollectibleResponse } from "../../../classes/corruption/responses/GetCollectibleResponse";
import { GetTrinketResponse } from "../../../classes/corruption/responses/GetTrinketResponse";
import { IfThenElseResponse } from "../../../classes/corruption/responses/IfThenElseResponse";
import { IfThenResponse } from "../../../classes/corruption/responses/IfThenResponse";
import { PlaySoundResponse } from "../../../classes/corruption/responses/PlaySoundResponse";
import { RemoveActionResponse } from "../../../classes/corruption/responses/RemoveActionResponse";
import { RemoveCollectibleResponse } from "../../../classes/corruption/responses/RemoveCollectibleResponse";
import { RemoveEntityResponse } from "../../../classes/corruption/responses/RemoveEntityResponse";
import { RemoveGridEntityResponse } from "../../../classes/corruption/responses/RemoveGridEntityResponse";
import type { Response } from "../../../classes/corruption/responses/Response";
import { SpawnEffectResponse } from "../../../classes/corruption/responses/SpawnEffectResponse";
import { SpawnEntityResponse } from "../../../classes/corruption/responses/SpawnEntityResponse";
import { SpawnGridEntityResponse } from "../../../classes/corruption/responses/SpawnGridEntityResponse";
import { SpawnHybridNPCResponse } from "../../../classes/corruption/responses/SpawnHybridNPCResponse";
import { SpawnLiveBombResponse } from "../../../classes/corruption/responses/SpawnLiveBombResponse";
import { SpawnNPCResponse } from "../../../classes/corruption/responses/SpawnNPCResponse";
import { SpawnPickupResponse } from "../../../classes/corruption/responses/SpawnPickupResponse";
import { SpawnRoomResponse } from "../../../classes/corruption/responses/SpawnRoomResponse";
import { SpawnSlotResponse } from "../../../classes/corruption/responses/SpawnSlotResponse";
import { SpawnTearResponse } from "../../../classes/corruption/responses/SpawnTearResponse";
import { TemporaryActionResponse } from "../../../classes/corruption/responses/TemporaryActionResponse";
import { TemporaryCollectibleResponse } from "../../../classes/corruption/responses/TemporaryCollectibleResponse";
import { TriggerInQueueResponse } from "../../../classes/corruption/responses/TriggerInQueueResponse";
import { TriggerInSequenceResponse } from "../../../classes/corruption/responses/TriggerInSequenceResponse";
import { TriggerOverTimeResponse } from "../../../classes/corruption/responses/TriggerOverTimeResponse";
import { TriggerRandomResponse } from "../../../classes/corruption/responses/TriggerRandomResponse";
import { UseActiveItemResponse } from "../../../classes/corruption/responses/UseActiveItemResponse";
import { WaitThenTriggerResponse } from "../../../classes/corruption/responses/WaitThenTriggerResponse";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";

const RESPONSE_TYPE_TO_RESPONSE_INITIALIZATION_MAP: ReadonlyMap<
  ResponseType,
  () => Response
> = new Map([
  [ResponseType.TRIGGER_RANDOM, () => new TriggerRandomResponse() as Response],
  [ResponseType.WAIT_THEN_TRIGGER, () => new WaitThenTriggerResponse()],
  [ResponseType.TRIGGER_OVER_TIME, () => new TriggerOverTimeResponse()],
  [ResponseType.TRIGGER_IN_SEQUENCE, () => new TriggerInSequenceResponse()],
  [ResponseType.IF_THEN_TRIGGER, () => new IfThenResponse()],
  [ResponseType.IF_THEN_ELSE_TRIGGER, () => new IfThenElseResponse()],
  [ResponseType.TRIGGER_IN_QUEUE, () => new TriggerInQueueResponse()],
  [ResponseType.USE_ACTIVE_ITEM, () => new UseActiveItemResponse()],
  // [ResponseType.USE_CARD, () => new GetCollectibleResponse()],

  // [ResponseType.USE_PILL, () => new GetCollectibleResponse()],
  [ResponseType.GET_COLLECTIBLE, () => new GetCollectibleResponse()],
  [ResponseType.GET_TRINKET, () => new GetTrinketResponse()],
  // [ResponseType.GET_CONSUMABLE, () => new GetCollectibleResponse()],
  [ResponseType.SPAWN_PICKUP, () => new SpawnPickupResponse()],
  [ResponseType.SPAWN_NPC, () => new SpawnNPCResponse()],
  [ResponseType.SPAWN_SLOT, () => new SpawnSlotResponse()],
  [ResponseType.SPAWN_TEAR, () => new SpawnTearResponse()],
  // [ResponseType.SPAWN_PROJECTILE, () => new GetCollectibleResponse()],
  [ResponseType.SPAWN_EFFECT, () => new SpawnEffectResponse()],
  [ResponseType.SPAWN_GRID, () => new SpawnGridEntityResponse()],
  [ResponseType.SPAWN_ENTITY, () => new SpawnEntityResponse()],
  [ResponseType.SPAWN_LIVE_BOMB, () => new SpawnLiveBombResponse()],
  [ResponseType.SPAWN_ROOM, () => new SpawnRoomResponse()],
  [ResponseType.PLAY_SOUND, () => new PlaySoundResponse()],
  // [ResponseType.PLAY_MUSIC, () => new GetCollectibleResponse()],

  // [ResponseType.GIVE_COSTUME, () => new GetCollectibleResponse()],

  // [ResponseType.GIVE_STAT, () => new GetCollectibleResponse()],

  // [ResponseType.TRANSFORM, () => new GetCollectibleResponse()],

  // [ResponseType.EXECUTE_COMMAND, () => new GetCollectibleResponse()],

  // [ResponseType.SHOW_FORTUNE, () => new GetCollectibleResponse()],

  // [ResponseType.GIVE_CURSE, () => new GetCollectibleResponse()],

  [ResponseType.REMOVE_ENTITY, () => new RemoveEntityResponse()],
  [ResponseType.REMOVE_GRID, () => new RemoveGridEntityResponse()],
  // [ResponseType.REMOVE_CORRUPTED_ITEM, () => new GetCollectibleResponse()],
  [ResponseType.REMOVE_COLLECTIBLE, () => new RemoveCollectibleResponse()],
  // [ResponseType.REMOVE_TRINKET, () => new GetCollectibleResponse()],

  // [ResponseType.REMOVE_RULE, () => new GetCollectibleResponse()],

  // [ResponseType.REROLL_COLLECTIBLE, () => new GetCollectibleResponse()],

  // [ResponseType.REROLL_TRINKET, () => new GetCollectibleResponse()],

  // [ResponseType.REROLL_STAT, () => new GetCollectibleResponse()],

  // [ResponseType.CHANGE_CHARACTER, () => new GetCollectibleResponse()],

  [ResponseType.SPAWN_HYBRID_NPC, () => new SpawnHybridNPCResponse()],

  // [ResponseType.PLAY_CORRUPTED_SOUND, () => new GetCollectibleResponse()],

  // [ResponseType.SPAWN_WORLD, () => new GetCollectibleResponse()],

  // [ResponseType.HAVE_DREAM, () => new GetCollectibleResponse()],

  // [ResponseType.HAVE_NIGHTMARE, () => new GetCollectibleResponse()],

  // [ResponseType.GET_ACTION_SET, () => new GetCollectibleResponse()],

  [ResponseType.TEMPORARY_ACTION, () => new TemporaryActionResponse()],

  // [ResponseType.TEMPORARY_ACTION_SET, () => new GetCollectibleResponse()],

  [
    ResponseType.TEMPORARY_COLLECTIBLE,
    () => new TemporaryCollectibleResponse(),
  ],

  // [ResponseType.TEMPORARY_TRINKET, () => new GetCollectibleResponse()],

  // [ResponseType.TEMPORARY_RULE, () => new GetCollectibleResponse()],

  // [ResponseType.PLAY_TUNE, () => new GetCollectibleResponse()],

  // [ResponseType.ADD_RULE, () => new GetCollectibleResponse()],

  [ResponseType.REMOVE_ACTION, () => new RemoveActionResponse()],
]);

/**
 * Get a Response from a ResponseType. The Response will be an empty Response.
 *
 * @param responseType The ResponseType to get the Response from.
 * @returns The Response.
 */
export function generateResponseFromResponseType(
  responseType: ResponseType,
): Response {
  const responseInit =
    RESPONSE_TYPE_TO_RESPONSE_INITIALIZATION_MAP.get(responseType);
  if (responseInit === undefined) {
    // TODO: Remove this.
    return new GetCollectibleResponse();
    // error( `No response initialization found for response type: ${responseType}`, );
  }
  return responseInit();
}
