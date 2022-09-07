import { Spread } from "./Spread";

export interface ComplexType<Type, ID> {
  type: Type;
  complexID: ID;
}

export type ComplexSpread<Type> = ComplexType<Spread<Type>, "ComplexSpread">;

export type ComplexSpreadOrType<Type> = ComplexType<
  ComplexSpread<Type> | Type,
  "ComplexSpreadOrType"
>;

export function isComplexType<Type, ID>(
  any: any,
  id: ID,
): any is ComplexType<Type, ID> {
  return (
    any && typeof any === "object" && "complexID" in any && any.complexID === id
  );
}

export function simplifyComplexType<Type, ID>(
  complexType: ComplexType<Type, ID>,
): Type {
  return complexType.type;
}

export function createComplexType<Type, ID>(
  any: any,
  id: ID,
): ComplexType<Type, ID> {
  return { type: any, complexID: id };
}
