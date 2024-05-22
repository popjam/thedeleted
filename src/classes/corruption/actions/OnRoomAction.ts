import { RoomType } from "isaac-typescript-definitions";
import { game, getRandomEnumValue, getRoomType } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { roomTypeToString as getRoomNameFromRoomType } from "../../../maps/data/name/roomTypeNameMap";
import { Action } from "./Action";
import { rollPercentage } from "../../../types/general/Percentage";
import { INFREQUENT_ROOMS } from "../../../constants/gameConstants";
import {
  ON_FLOOR_ACTION_FREQUENCY,
  ON_ROOM_ACTION_FREQUENCY,
} from "../../../constants/severityConstants";

const ACTION_TYPE = ActionType.ON_ROOM;
const THE_CHEST_TEXT_SINGULAR = "visit to the Chest";
const THE_CHEST_TEXT_PLURAL = "visits to the Chest";

/** Triggers every floor. */
export class OnRoomAction extends Action {
  override actionType = ACTION_TYPE;
  rT?: RoomType;

  /**
   * Constructs an instance of the OnRoomAction class.
   *
   * @param roomType The room type to set (optional).
   * @returns The instance of the OnRoomAction class.
   */
  construct(roomType?: RoomType): this {
    if (roomType !== undefined) {
      this.setRoomType(roomType);
    }
    return this;
  }

  override getIdealSeverity(): number {
    const roomType = this.getRoomType();
    if (roomType === undefined) {
      return super.getIdealSeverity(ON_ROOM_ACTION_FREQUENCY);
    }

    if (roomType === RoomType.DEFAULT) {
      return super.getIdealSeverity(ON_ROOM_ACTION_FREQUENCY);
    }

    if (INFREQUENT_ROOMS.includes(roomType)) {
      return super.getIdealSeverity(ON_FLOOR_ACTION_FREQUENCY / 4);
    }

    return super.getIdealSeverity(ON_FLOOR_ACTION_FREQUENCY);
  }

  override shuffle(): this {
    const CHANCE_FOR_ROOM_TYPE = 20;

    if (rollPercentage(CHANCE_FOR_ROOM_TYPE)) {
      const randomRoomType = getRandomEnumValue(RoomType, undefined);
      this.setRoomType(randomRoomType);
    }

    return super.shuffle();
  }

  /** If set, will only fire on the specified RoomType. */
  getRoomType(): RoomType | undefined {
    return this.rT;
  }

  /** If set, will only fire on the specified RoomType. */
  setRoomType(roomType: RoomType): this {
    this.rT = roomType;
    return this;
  }

  getRoomTypeText(plural = false): string | undefined {
    const { rT: roomType } = this;
    if (roomType !== undefined) {
      if (roomType === RoomType.VAULT) {
        return plural ? THE_CHEST_TEXT_PLURAL : THE_CHEST_TEXT_SINGULAR;
      }
      const name = getRoomNameFromRoomType(roomType).toLowerCase();
      return addTheS(name, plural);
    }
    return undefined;
  }

  /**
   * Example: "angel room".
   *
   * @returns The trigger clause for the OnRoomAction.
   */
  protected override getTriggerClause(plural = false): string {
    return this.getRoomTypeText(plural) ?? addTheS("room", plural);
  }

  override trigger(triggerData: TriggerData): void {
    const room = game.GetRoom();
    if (!room.IsFirstVisit()) {
      return;
    }

    if (this.rT !== undefined && getRoomType() !== this.rT) {
      return;
    }

    super.trigger(triggerData);
  }
}

/** Triggers all OnRoomActions for all players. */
export function triggerOnRoomActions(): void {
  triggerPlayersActionsByType(ACTION_TYPE, {});
}
