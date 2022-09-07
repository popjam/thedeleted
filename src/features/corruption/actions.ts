/** Functions related to accessing, modifying and triggering actions. */

import { combineArrays, getRandomArrayElement } from "isaacscript-common";
import { Action } from "../../interfaces/corruption/Action";
import {
  Response,
  ResponseReturnData,
} from "../../interfaces/corruption/Response";
import { randomInRange } from "../../types/Range";
import { triggerResponse } from "./responses";

/**
 * General function to trigger any action. Follows these 'checks' before firing, returns undefined
 * if the checks stop it from firing, otherwise ResponseReturnData:
 *
 * @example First, checks 'activateAfter', if there is, decrements it.
 * @example Then, check if there is an interval, if there is, increments it and either aborts or
 *          continues.
 * @example Check if there are multiple responses, and if 'triggerAll' is checked.
 * @example Fire appropriate responses.
 */
export function triggerAction(
  action: Action,
  player: EntityPlayer,
): ResponseReturnData | ResponseReturnData[] | undefined {
  if (action.responses !== undefined) {
    // If there is Activate after X.
    if (action.tags?.activateAfter !== undefined) {
      action.tags.activateAfter--;
      if (action.tags.activateAfter === 0) {
        // Action is removed after firing (or not firing).
        action.tags.flagForRemoval = true;
      } else {
        return undefined;
      }
    }
    // If there is Activate in intervals.
    if (action.tags?.interval !== undefined) {
      let interval = action.tags.interval[0];
      if (typeof interval !== "number") {
        interval = randomInRange(interval);
      }
      action.tags.interval[1]++;
      if (action.tags.interval[1] >= interval) {
        action.tags.interval[1] = 0;
      } else {
        return undefined;
      }
    }
    // If there are multiple responses.
    if (Array.isArray(action.responses)) {
      if (action.tags?.triggerAll ?? false) {
        return triggerAllResponses(action.responses, player);
      }
      return triggerResponse(getRandomArrayElement(action.responses), player);
    }
    return triggerResponse(action.responses, player);
  }
  return undefined;
}

/** Trigger all responses in an array. */
function triggerAllResponses(responses: Response[], player: EntityPlayer) {
  let returnDataArray: ResponseReturnData[] = [];
  responses.forEach((response) => {
    const returnData = triggerResponse(response, player);
    if (returnData !== undefined) {
      if (Array.isArray(returnData)) {
        returnDataArray = combineArrays(returnDataArray, returnData);
      } else {
        returnDataArray.push(returnData);
      }
    }
  });
  return returnDataArray;
}
