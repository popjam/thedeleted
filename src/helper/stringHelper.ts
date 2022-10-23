import { capitalizeFirstLetter } from "isaacscript-common";
import { patternToPlainString } from "./patternHelper";

/** Removes unnecessary spaces, capitalizes first letter. */
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
