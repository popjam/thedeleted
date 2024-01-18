import type { IfThenElseResponse } from "../../classes/corruption/responses/IfThenElseResponse";
import type { IfThenResponse } from "../../classes/corruption/responses/IfThenResponse";
import type { TriggerInQueueResponse } from "../../classes/corruption/responses/TriggerInQueueResponse";
import type { TriggerInSequenceResponse } from "../../classes/corruption/responses/TriggerInSequenceResponse";
import type { TriggerRandomResponse } from "../../classes/corruption/responses/TriggerRandomResponse";

/**
 * Type union of Responses which are responsible for triggering other responses using logic 'AND',
 * 'OR', 'IF THEN', or 'IF THEN ELSE'. These Responses will always return a Response when triggered.
 */
export type LogicResponseUnion =
  | TriggerRandomResponse
  | TriggerInSequenceResponse
  | TriggerInQueueResponse
  | IfThenElseResponse
  | IfThenResponse;
