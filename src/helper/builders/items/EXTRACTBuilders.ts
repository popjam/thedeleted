import { CollectibleType } from "isaac-typescript-definitions";
import { Response } from "../../../classes/corruption/responses/Response";
import { UseActiveItemResponse } from "../../../classes/corruption/responses/UseActiveItemResponse";
import { Morality } from "../../../enums/corruption/Morality";

/** Generates a new Response to be used while rerolling items with the EXTRACT item. */
export function extractResponseBuilder(): Response {
  return new UseActiveItemResponse()
    .construct(CollectibleType.POOP)
    .setMorality(Morality.NEGATIVE);
}
