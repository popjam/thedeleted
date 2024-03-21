import { RoomType } from "isaac-typescript-definitions";
import { game, getRoomType } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { roomTypeToString as getRoomNameFromRoomType } from "../../../maps/data/name/roomTypeNameMap";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_ROOM;
const SINGULAR_CHEST_CLAUSE = "visits to the Chest";
const PLURAL_CHEST_CLAUSE = "time you enter the Chest";
const SINGULAR_NUMBER = 1;
const PLURAL_NUMBER = 2;

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

  /** If set, will only fire on the specified RoomType. */
  getRoomType(): RoomType | undefined {
    return this.rT;
  }

  /** If set, will only fire on the specified RoomType. */
  setRoomType(roomType: RoomType): this {
    this.rT = roomType;
    return this;
  }

  getRoomTypeText(amount: number): string | undefined {
    const { rT: roomType } = this;
    if (roomType !== undefined) {
      if (roomType === RoomType.VAULT) {
        if (amount !== 1) {
          return SINGULAR_CHEST_CLAUSE;
        }
        return PLURAL_CHEST_CLAUSE;
      }
      const name = getRoomNameFromRoomType(roomType).toLowerCase();
      return addTheS(name, amount);
    }
    return undefined;
  }

  // Override the trigger clause for OnRoomAction.
  protected override getTriggerClause(): string {
    const amount = this.getInterval() ?? 1;
    let intervalNoRange = amount;
    if (typeof intervalNoRange !== "number") {
      intervalNoRange = intervalNoRange[1];
    }
    return `you enter ${
      this.getRoomTypeText(intervalNoRange) ??
      addTheS("a room", intervalNoRange)
    }`;
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
