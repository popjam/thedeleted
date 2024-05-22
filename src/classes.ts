import { InvertedActiveActionSet } from "./classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { InvertedPassiveActionSet } from "./classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { NonInvertedPickupActionSet } from "./classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { OnActiveUseAction } from "./classes/corruption/actions/OnActiveUseAction";
import { OnBombExplodeAction } from "./classes/corruption/actions/OnBombExplodeAction";
import { OnCardUseAction } from "./classes/corruption/actions/OnCardUseAction";
import { OnDamageAction } from "./classes/corruption/actions/OnDamageAction";
import { OnDeathAction } from "./classes/corruption/actions/OnDeathAction";
import { OnFloorAction } from "./classes/corruption/actions/OnFloorAction";
import { OnGreedWaveClearAction } from "./classes/corruption/actions/OnGreedWaveClearAction";
import { OnKillAction } from "./classes/corruption/actions/OnKillAction";
import { OnObtainAction } from "./classes/corruption/actions/OnObtainAction";
import { OnPickupCollectAction } from "./classes/corruption/actions/OnPickupCollectAction";
import { OnPillUseAction } from "./classes/corruption/actions/OnPillUseAction";
import { OnPurchaseAction } from "./classes/corruption/actions/OnPurchaseAction";
import { OnReviveAction } from "./classes/corruption/actions/OnReviveAction";
import { OnRoomAction } from "./classes/corruption/actions/OnRoomAction";
import { OnRoomClearAction } from "./classes/corruption/actions/OnRoomClearAction";
import { OnSacrificeAction } from "./classes/corruption/actions/OnSacrificeAction";
import { OnSlotDestroyAction } from "./classes/corruption/actions/OnSlotDestroyAction";
import { OnSlotUseAction } from "./classes/corruption/actions/OnSlotUseAction";
import { OnStatAction } from "./classes/corruption/actions/OnStatAction";
import { GetCollectibleResponse } from "./classes/corruption/responses/GetCollectibleResponse";
import { GetTrinketResponse } from "./classes/corruption/responses/GetTrinketResponse";
import { IfThenElseResponse } from "./classes/corruption/responses/IfThenElseResponse";
import { IfThenResponse } from "./classes/corruption/responses/IfThenResponse";
import { RemoveActionResponse } from "./classes/corruption/responses/RemoveActionResponse";
import { RemoveCollectibleResponse } from "./classes/corruption/responses/RemoveCollectibleResponse";
import { RemoveEntityResponse } from "./classes/corruption/responses/RemoveEntityResponse";
import { RemoveGridEntityResponse } from "./classes/corruption/responses/RemoveGridEntityResponse";
import { SpawnEffectResponse } from "./classes/corruption/responses/SpawnEffectResponse";
import { SpawnEntityResponse } from "./classes/corruption/responses/SpawnEntityResponse";
import { SpawnGridEntityResponse } from "./classes/corruption/responses/SpawnGridEntityResponse";
import { SpawnHybridNPCResponse } from "./classes/corruption/responses/SpawnHybridNPCResponse";
import { SpawnLiveBombResponse } from "./classes/corruption/responses/SpawnLiveBombResponse";
import { SpawnNPCResponse } from "./classes/corruption/responses/SpawnNPCResponse";
import { SpawnPickupResponse } from "./classes/corruption/responses/SpawnPickupResponse";
import { SpawnSlotResponse } from "./classes/corruption/responses/SpawnSlotResponse";
import { SpawnTearResponse } from "./classes/corruption/responses/SpawnTearResponse";
import { TemporaryActionResponse } from "./classes/corruption/responses/TemporaryActionResponse";
import { TemporaryCollectibleResponse } from "./classes/corruption/responses/TemporaryCollectibleResponse";
import { TransformResponse } from "./classes/corruption/responses/TransformResponse";
import { TriggerInSequenceResponse } from "./classes/corruption/responses/TriggerInSequenceResponse";
import { TriggerOverTimeResponse } from "./classes/corruption/responses/TriggerOverTimeResponse";
import { TriggerRandomResponse } from "./classes/corruption/responses/TriggerRandomResponse";
import { UseActiveItemResponse } from "./classes/corruption/responses/UseActiveItemResponse";
import { WaitThenTriggerResponse } from "./classes/corruption/responses/WaitThenTriggerResponse";
import { LevelOneWorm } from "./classes/worms/LevelOneWorm";
import { mod } from "./mod";

export function initClasses(): void {
  mod.saveDataManagerRegisterClass(
    InvertedPassiveActionSet,
    InvertedActiveActionSet,
    NonInvertedPickupActionSet,
    OnDamageAction,
    OnFloorAction,
    OnObtainAction,
    OnRoomAction,
    OnKillAction,
    OnDeathAction,
    OnPurchaseAction,
    OnActiveUseAction,
    OnPillUseAction,
    OnCardUseAction,
    OnDamageAction,
    OnStatAction,
    OnBombExplodeAction,
    OnGreedWaveClearAction,
    OnReviveAction,
    OnRoomClearAction,
    UseActiveItemResponse,
    WaitThenTriggerResponse,
    TriggerRandomResponse,
    TriggerOverTimeResponse,
    TriggerInSequenceResponse,
    TemporaryCollectibleResponse,
    TemporaryActionResponse,
    RemoveCollectibleResponse,
    RemoveActionResponse,
    SpawnNPCResponse,
    SpawnPickupResponse,
    LevelOneWorm,
    GetCollectibleResponse,
    RemoveEntityResponse,
    SpawnSlotResponse,
    SpawnTearResponse,
    SpawnEffectResponse,
    SpawnGridEntityResponse,
    GetTrinketResponse,
    SpawnLiveBombResponse,
    IfThenResponse,
    IfThenElseResponse,
    TransformResponse,
    RemoveGridEntityResponse,
    SpawnEntityResponse,
    SpawnHybridNPCResponse,
    OnSacrificeAction,
    OnSlotUseAction,
    OnSlotDestroyAction,
    OnPickupCollectAction,
  );
}
