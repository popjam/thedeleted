/** Make a readonly value writeable. */
export type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};
