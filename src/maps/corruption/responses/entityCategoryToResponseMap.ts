import type { Response } from "../../../classes/corruption/responses/Response";
import { SpawnEffectResponse } from "../../../classes/corruption/responses/SpawnEffectResponse";
import { SpawnLiveBombResponse } from "../../../classes/corruption/responses/SpawnLiveBombResponse";
import { SpawnNPCResponse } from "../../../classes/corruption/responses/SpawnNPCResponse";
import { SpawnPickupResponse } from "../../../classes/corruption/responses/SpawnPickupResponse";
import { SpawnSlotResponse } from "../../../classes/corruption/responses/SpawnSlotResponse";
import { SpawnTearResponse } from "../../../classes/corruption/responses/SpawnTearResponse";
import { EntityCategory } from "../../../enums/general/EntityCategory";

const ENTITY_CATEGORY_TO_RESPONSE_MAP: ReadonlyMap<
  EntityCategory,
  () => Response
> = new Map([
  [EntityCategory.BOMB, () => new SpawnLiveBombResponse() as Response],
  [EntityCategory.EFFECT, () => new SpawnEffectResponse() as Response],

  // [EntityCategory.FAMILIAR, () => new SpawnEffectResponse() as Response].

  // [EntityCategory.KNIFE, () => new SpawnEffectResponse() as Response].

  // [EntityCategory.LASER, () => new SpawnEffectResponse() as Response].

  [EntityCategory.NPC, () => new SpawnNPCResponse() as Response],
  [EntityCategory.PICKUP, () => new SpawnPickupResponse() as Response],

  // [EntityCategory.PLAYER, () => new SpawnEffectResponse() as Response].

  // [EntityCategory.PROJECTILE, () => new SpawnEffectResponse() as Response].

  [EntityCategory.TEAR, () => new SpawnTearResponse() as Response],
  [EntityCategory.SLOT, () => new SpawnSlotResponse() as Response],
]);

export function getResponseFromEntityCategory(
  entityCategory: EntityCategory,
): Response {
  const responseConstructor =
    ENTITY_CATEGORY_TO_RESPONSE_MAP.get(entityCategory);
  if (responseConstructor === undefined) {
    error(
      `No response constructor found for entity category ${entityCategory}`,
    );
  }

  return responseConstructor();
}
