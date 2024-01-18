import type { SpawnEffectResponse } from "../../classes/corruption/responses/SpawnEffectResponse";
import type { SpawnLiveBombResponse } from "../../classes/corruption/responses/SpawnLiveBombResponse";
import type { SpawnNPCResponse } from "../../classes/corruption/responses/SpawnNPCResponse";
import type { SpawnPickupResponse } from "../../classes/corruption/responses/SpawnPickupResponse";
import type { SpawnSlotResponse } from "../../classes/corruption/responses/SpawnSlotResponse";
import type { SpawnTearResponse } from "../../classes/corruption/responses/SpawnTearResponse";

/** Type union of Responses which spawn non-grid Entities. */
export type SpawnResponseUnion =
  | SpawnEffectResponse
  | SpawnNPCResponse
  | SpawnLiveBombResponse
  | SpawnPickupResponse
  | SpawnSlotResponse
  | SpawnTearResponse;
