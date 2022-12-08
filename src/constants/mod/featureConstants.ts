import { mod } from "../../mod";
import { EveryItemIsFeature } from "../../modFeatures/general/EveryItemIsFeature";
import { TooManyItemsFeature } from "../../modFeatures/general/TooManyItemsFeature";

/** An object containing all 'ModFeatures'. */
export const CustomModFeatures = {
  EveryItemIsFeature: new EveryItemIsFeature(mod, false),
  TooManyItemsFeature: new TooManyItemsFeature(mod, false),
} as const;
