import type { Response } from "../../../classes/corruption/responses/Response";

/** Responses which conditionally trigger one of the Responses stored inside them. */
export interface LogicResponseInterface<T extends Response> {}
