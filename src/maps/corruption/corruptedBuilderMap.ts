/**
 * Builders are anonymous functions which return a certain type. This is useful when you need to not
 * only store a value of a certain type, but also the GENERATION method to making a value of a
 * certain type. As JSON can not store functions, it stores a reference to them, with all of them
 * being saved in a central enum. When the Builder is needed, the reference will be input into a
 * map, which will then retrieve the anonymous function.
 *
 * This file stores the ENUMs and their relevant MAP.
 */

import { CollectibleType } from "isaac-typescript-definitions";
import { Builders } from "../../enums/Builders";
import { ActionType } from "../../enums/corruption/ActionType";
import { ResponseType } from "../../enums/corruption/ResponseType";
import { Action } from "../../interfaces/corruption/Action";
import {
  ActionSet,
  ActionSetType,
} from "../../interfaces/corruption/ActionSet";
import { Response } from "../../interfaces/corruption/Response";
import { Builder } from "../../types/Builder";

/** The functions returned from this map will ALWAYS return an ActionSet on calling them. */
export const ACTION_SET_BUILDER_MAP: ReadonlyMap<
  keyof Builders,
  Builder<ActionSet>
> = new Map([
  [
    Builders.ACTION_SET_BUILDER_DEFAULT,
    () => ({ actionSetType: ActionSetType.STANDARD, actions: [] }),
  ],
]);

/** The functions returned from this map will ALWAYS return an Action on calling them. */
export const ACTION_BUILDER_MAP: ReadonlyMap<
  keyof Builders,
  Builder<Action>
> = new Map([
  [
    Builders.ACTION_SET_BUILDER_DEFAULT,
    () => ({ actionType: ActionType.ON_FLOOR }),
  ],
]);

/** The functions returned from this map will ALWAYS return an Response on calling them. */
export const RESPONSE_BUILDER_MAP: ReadonlyMap<
  keyof Builders,
  Builder<Response>
> = new Map([
  [
    Builders.RESPONSE_BUILDER_DEFAULT,
    () => ({
      responseType: ResponseType.GET_COLLECTIBLE,
      collectible: CollectibleType.ABADDON,
    }),
  ],
]);
