import { capitalizeFirstLetter, getRandomInt } from "isaacscript-common";
import { patternToPlainString } from "./patternHelper";

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
  return typeof string.find(s, "^%d")[0] !== "undefined";
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
  if (len < 3) {
    num = string.find(s, "[.]", getRandomInt(1, len))[1];
  } else {
    num = string.find(s, "[AEIOUaeiou]", getRandomInt(2, len))[1];
  }
  const prefix = string.sub(s, 1, num);
  return prefix;
}

export function getRandomSuffix(s: string): string {
  const len = s.length;
  let num = 1;
  if (len < 3) {
    num = string.find(s, "[.]", getRandomInt(1, len - 1))[1];
  } else {
    num = string.find(s, "[^AEIOUaeiou]", getRandomInt(1, len - 1))[1];
  }
  const suffix = string.sub(s, num, len);
  return suffix;
}
