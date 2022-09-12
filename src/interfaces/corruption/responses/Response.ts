import { CollectibleType } from "isaac-typescript-definitions";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { ResponseTag } from "./ResponseTag";

/**
 * Every response has one purpose, in the form of changing the game in one way or another. A
 * response can be further modified with ResponseTags.
 *
 * @example 'Spawn 3 spiders'.
 * @function TriggerResponse(Response) Is used to activate the response. Note it will not always do
 *           something, as the response may have chance based activation tags or other modifying
 *           tags.
 */
export type Response = UseActiveItemResponse | GetCollectibleResponse;

/** Response for using active items. */
export interface UseActiveItemResponse {
  responseType: ResponseType.USE_ACTIVE_ITEM;
  activeItem: CollectibleType;
  tags?: ResponseTag;
}

/** Response for getting a collectible. */
export interface GetCollectibleResponse {
  responseType: ResponseType.GET_COLLECTIBLE;
  collectible: CollectibleType;
  tags?: ResponseTag;
}

/**
 * Contains information about the response after triggering it. ResponseTypes without a specific
 * ReturnData interface fall back on this general ResponseReturnData interface. All responses return
 * ResponseReturnData after triggering regardless of the result.
 *
 * @param fired Was the response successfully fired?
 */
export interface ResponseReturnData {
  fired: boolean;
}
