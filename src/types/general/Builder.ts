import { ActionSet } from "../../classes/corruption/actionSets/ActionSet";
import { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";

export type Builder<Type> = (...args: any[]) => Type;

export type ActionSetBuilder = (inputs?: ActionSetBuilderInput) => ActionSet;

export type InvertedItemActionSetBuilder = (
  inputs?: ActionSetBuilderInput,
) => InvertedActiveActionSet;
