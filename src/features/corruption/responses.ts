/** General functions related to accessing, modifying and triggering responses. */

import { ResponseType } from "../../enums/corruption/ResponseType";
import { percentage } from "../../helper/numberHelper";
import {
  GetCollectibleResponse,
  Response,
  ResponseReturnData,
  UseActiveItemResponse,
} from "../../interfaces/corruption/Response";
import { randomInRange } from "../../types/Range";

/** Maps each ResponseType to its trigger function. */
const RESPONSE_TRIGGER_MAP: ReadonlyMap<
  ResponseType,
  (response: Response, player: EntityPlayer) => ResponseReturnData
> = new Map([
  [
    ResponseType.USE_ACTIVE_ITEM,
    (response: Response, player: EntityPlayer): ResponseReturnData =>
      triggerUseActiveItemResponse(response as UseActiveItemResponse, player),
  ],
  [
    ResponseType.GET_COLLECTIBLE,
    (response: Response, player: EntityPlayer): ResponseReturnData =>
      triggerGetCollectibleResponse(response as GetCollectibleResponse, player),
  ],
]);

/**
 * General function to trigger any response. Will go through these checks in order, and return
 * ResponseReturnData regardless of whether it fires or not:
 *
 * @example Chance to abort firing (chanceToActivate).
 * @example How many amountOfActivations (defaults to 1).
 * @example Fire single or multiple depending on amountOfActivations.
 */
export function triggerResponse(
  response: Response,
  player: EntityPlayer,
): ResponseReturnData | ResponseReturnData[] | undefined {
  const triggerFunction = RESPONSE_TRIGGER_MAP.get(response.responseType);
  if (triggerFunction !== undefined) {
    // Random chance to not fire.
    if (response.tags?.chanceToActivate !== undefined) {
      if (!percentage(response.tags.chanceToActivate)) {
        return { fired: false };
      }
    }
    // Amount of activations.
    let amountOfActivations = 1;
    if (response.tags?.amountOfActivations !== undefined) {
      if (typeof response.tags.amountOfActivations === "number") {
        amountOfActivations = response.tags.amountOfActivations;
      } else {
        amountOfActivations = randomInRange(response.tags.amountOfActivations);
      }
    }
    // If there is only one activation.
    if (amountOfActivations === 1) {
      return triggerFunction(response, player);
    }
    // If there are multiple activations.
    const returnDataArray: ResponseReturnData[] = [];
    for (let i = 0; i < amountOfActivations; i++) {
      returnDataArray.push(triggerFunction(response, player));
    }
    return returnDataArray;
  }
  return { fired: false };
}

/** Trigger function for UseActiveItemResponse responses. */
function triggerUseActiveItemResponse(
  response: UseActiveItemResponse,
  player: EntityPlayer,
): ResponseReturnData {
  player.UseActiveItem(response.activeItem);
  return { fired: true };
}

/** Trigger function for GetCollectibleResponse responses. */
function triggerGetCollectibleResponse(
  response: GetCollectibleResponse,
  player: EntityPlayer,
): ResponseReturnData {
  player.AddCollectible(response.collectible);
  return { fired: true };
}
