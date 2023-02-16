import { mod } from "../../mod";
import { CantPickupFeature } from "../../modFeatures/general/CantPickupFeature";
import { CustomActiveFeature } from "../../modFeatures/general/CustomActiveFeature";
import { EveryItemIsFeature } from "../../modFeatures/general/EveryItemIsFeature";
import { HybridNPCFeature } from "../../modFeatures/general/HybridNPCFeature";
import { TooManyItemsFeature } from "../../modFeatures/general/TooManyItemsFeature";
import {
  NAONDAONDWA,
  UnusedFeature,
} from "../../modFeatures/general/UnusedFeature";
import { WormFeature } from "../../modFeatures/modes/WormFeature";

/** An object containing all 'ModFeatures'. */
export const CustomModFeatures = {
  EveryItemIsFeature: new EveryItemIsFeature(mod, false),
  TooManyItemsFeature: new TooManyItemsFeature(mod, false),
  WormFeature: new WormFeature(mod, false),
  HybridNPCFeature: new HybridNPCFeature(mod, false),
  CantPickupFeature: new CantPickupFeature(mod, false),
  CustomThing: new NAONDAONDWA(mod, false),
  CustomActive: new CustomActiveFeature(mod, false),
} as const;

export const AAAAA = new UnusedFeature(mod, false);
