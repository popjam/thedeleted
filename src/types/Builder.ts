export type Builder<Type> = (...args: any[]) => Type;

export function isBuilder<Type>(arg: any): arg is Builder<Type> {
  return arg && typeof arg === "function";
}
