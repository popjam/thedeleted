import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";

const VERB = "spawn";
const VERB_PARTICIPLE = "spawning";

/** Response to spawn a Room. */
export class SpawnRoomResponse extends Response {
  override responseType: ResponseType = ResponseType.SPAWN_ROOM;

  construct(): this {
    return this;
  }

  override getSeverity(): number {
    return this.getSeverity();
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  /**
   * Get noun text.
   *
   * @example "a random pickup"
   * @example "a random bomb"
   * @example "3 sticky nickels"
   */
  override getNoun(): string {
    return "room";
  }

  getText(_eid: boolean, participle: boolean): string {
    const noun = this.getNoun();
    const verb = this.getVerb(participle);

    return `${verb} ${noun}`;
  }

  fire(_triggerData: TriggerData): void {}
}
