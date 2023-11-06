import { capitalizeFirstLetter, getRandomInt } from "isaacscript-common";
import { patternToPlainString } from "./patternHelper";
import { getRandomInteger } from "./randomHelper";

/**
 * Removes unnecessary spaces, capitalizes first letter.
 * TODO: fix: "thing ," <-- space before comma.
 */
export function legibleString(s: string): string {
  return capitalizeFirstLetter(removeUnnecessaryWhiteSpace(s));
}

/** Remove unnecessary spaces from the whole string. */
export function removeUnnecessaryWhiteSpace(s: string): string {
  return string.gsub(s.trim(), "%s+", " ")[0];
}

/** Returns number of occurrences of String or Character in string. */
export function getNumberOfStringInString(s: string, pattern: string): number {
  return string.gsub(s, patternToPlainString(pattern), "")[1];
}

/** Does the string start with a digit (0-9). */
export function stringStartsWithDigit(s: string): boolean {
  return string.find(s, "^%d")[0] !== undefined;
}

/** If n is not 1, will add an 's' to the string. */
export function addTheS(s: string, n: number): string {
  if (n !== 1) {
    return `${s}s`;
  }
  return s;
}

export function getRandomPrefix(s: string): string {
  const len = s.length;
  let num = 1;
  num =
    len < 3
      ? string.find(s, "[.]", getRandomInteger(1, len, undefined))[1]
      : string.find(s, "[AEIOUaeiou]", getRandomInteger(2, len, undefined))[1];
  const prefix = string.sub(s, 1, num);
  return prefix;
}

export function getRandomSuffix(s: string): string {
  const len = s.length;
  let num = 1;
  num =
    len < 3
      ? string.find(s, "[.]", getRandomInteger(1, len - 1, undefined))[1]
      : string.find(
          s,
          "[^AEIOUaeiou]",
          getRandomInteger(1, len - 1, undefined),
        )[1];
  const suffix = string.sub(s, num, len);
  return suffix;
}

/**
 * Returns a string joining all elements in the array, where the last two elements are joined with
 * "or", and the rest are joined with commas.
 */
export function joinWithOr(arr: string[]): string {
  const len = arr.length;
  if (len === 0) {
    return "";
  }
  if (len === 1) {
    return arr[0] ?? "";
  }
  if (len === 2) {
    return `${arr[0]} or ${arr[1]}`;
  }
  const lastTwo = `${arr[len - 2]} or ${arr[len - 1]}`;
  const rest = arr.slice(0, len - 2).join(", ");
  return `${rest}, ${lastTwo}`;
}
