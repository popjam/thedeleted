import { ResponseType } from "../../../enums/corruption/responses/ResponseType";

export interface ResponseReturnData {
  [ResponseType.USE_ACTIVE_ITEM]: string;
}

const thing: ResponseReturnData = {
  [ResponseType.USE_ACTIVE_ITEM]: "string",
};
