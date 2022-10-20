import { ActionType } from "../../../enums/corruption/actions/ActionType";

/**
 * Data that you can provide when triggering an Action or Response. If you pass through triggerData
 * when triggering an Action, it will be passed through to the Response.
 */
export interface TriggerData {
  actionType?: ActionType;
  entity?: Entity;
}
