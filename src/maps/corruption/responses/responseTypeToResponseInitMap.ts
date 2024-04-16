import { GetCollectibleResponse } from "../../../classes/corruption/responses/GetCollectibleResponse";
import { PlaySoundResponse } from "../../../classes/corruption/responses/PlaySoundResponse";
import { RemoveActionResponse } from "../../../classes/corruption/responses/RemoveActionResponse";
import type { Response } from "../../../classes/corruption/responses/Response";
import { TemporaryActionResponse } from "../../../classes/corruption/responses/TemporaryActionResponse";
import { TemporaryActionSetResponse } from "../../../classes/corruption/responses/TemporaryActionSetResponse";
import { TemporaryCollectibleResponse } from "../../../classes/corruption/responses/TemporaryCollectibleResponse";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";

const RESPONSE_TYPE_TO_RESPONSE_INITIALIZATION_MAP: ReadonlyMap<
  ResponseType,
  () => Response
> = new Map([
  [ResponseType.PLAY_SOUND, () => new PlaySoundResponse() as Response],
  [ResponseType.GET_COLLECTIBLE, () => new GetCollectibleResponse()],
  [ResponseType.PLAY_SOUND, () => new PlaySoundResponse()],
  [ResponseType.GET_COLLECTIBLE, () => new GetCollectibleResponse()],
  [ResponseType.TEMPORARY_ACTION, () => new TemporaryActionResponse()],
  [ResponseType.TEMPORARY_ACTION_SET, () => new TemporaryActionSetResponse()],
  [
    ResponseType.TEMPORARY_COLLECTIBLE,
    () => new TemporaryCollectibleResponse(),
  ],
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
    error(
      `No response initialization found for response type: ${responseType}`,
    );
  }
  return responseInit();
}
