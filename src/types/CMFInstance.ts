import { Rule } from "../enums/customModFeatures/rules";
import { EveryItemIsInstance } from "../modFeatures/general/EveryItemIsFeature";
import { TooManyItemsInstance } from "../modFeatures/general/TooManyItemsFeature";

/** A type union of Custom Mod Feature Instance interfaces. */
export type CMFInstance = EveryItemIsInstance | TooManyItemsInstance;

/** Rule plus the blueprint for CMFInstances. */
export type RulePlusInstance = [Rule, CMFInstance];
