import { getRandomInt } from "isaacscript-common";

/** A bunch of settings unique to each player. */
export type Spread<Type> = Array<[Type, number]>;

/** Get a random value from the spread. */
export function spread<Type>(spread: Spread<Type>): Type | undefined {
  let total = 0;
  spread.forEach((value) => {
    total += value[1];
  });
  const randomNumber = getRandomInt(1, total);
  let countNumber = 0;
  for (const value of spread) {
    countNumber += value[1];
    if (countNumber >= randomNumber) {
      return value[0];
    }
  }
  return undefined;
}
