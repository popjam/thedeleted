import type { EntityID } from "isaacscript-common";
import type { PickupID } from "../../enums/data/ID/PickupID";
import type { FamiliarID } from "../../enums/data/ID/FamiliarID";
import type { EffectID } from "../../enums/data/ID/EffectID";
import type { NPCID } from "isaac-typescript-definitions";

export type EntityIDTypeUnion =
  | EntityID
  | PickupID
  | FamiliarID
  | EffectID
  | NPCID;
