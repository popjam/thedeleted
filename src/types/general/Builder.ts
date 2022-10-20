import { ActionSet } from "../../classes/corruption/actionSets/ActionSet";
import { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";

export type Builder<Type> = (...args: any[]) => Type;

export type ActionSetBuilder = (inputs?: ActionSetBuilderInput) => ActionSet;
