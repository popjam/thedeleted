import { Rule } from "../enums/customModFeatures/rules";
import {
  CantPickupInput,
  CantPickupInstance,
} from "../modFeatures/general/CantPickupFeature";
import { CustomActiveInput } from "../modFeatures/general/CustomActiveFeature";
import {
  EveryItemIsInput,
  EveryItemIsInstance,
} from "../modFeatures/general/EveryItemIsFeature";
import {
  HybridNPCInput,
  HybridNPCInstance,
} from "../modFeatures/general/HybridNPCFeature";
import {
  TooManyItemsInput,
  TooManyItemsInstance,
} from "../modFeatures/general/TooManyItemsFeature";
import {
  CustomActiveInstance,
  UnusedFeatureInstance,
} from "../modFeatures/general/UnusedFeature";
import {
  WormFeatureInput,
  WormFeatureInstance,
} from "../modFeatures/modes/WormFeature";

/** A type union of Custom Mod Feature Instance interfaces. */
export type CMFInstance =
  | EveryItemIsInstance
  | TooManyItemsInstance
  | WormFeatureInstance
  | HybridNPCInstance
  | CantPickupInstance
  | UnusedFeatureInstance
  | CustomActiveInstance;

export type CMFInputs =
  | TooManyItemsInput
  | EveryItemIsInput
  | WormFeatureInput
  | HybridNPCInput
  | CantPickupInput
  | CustomActiveInput;

/** Rule plus the blueprint for CMFInstances. */
export type RulePlusInstance = [Rule, CMFInputs];
