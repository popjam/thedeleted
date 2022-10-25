import { TestFeature } from "../../features/modFeatures/test";
import { mod } from "../../mod";

/** An object containing all 'ModFeatures'. */
export const ModFeatures = {
  testFeature: new TestFeature(mod, false),
} as const;
