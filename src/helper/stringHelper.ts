import { capitalizeFirstLetter, getRandomInt } from "isaacscript-common";
import { patternToPlainString } from "./patternHelper";
import { getRandomInteger } from "./randomHelper";

const articles = new Set(["a", "an", "the"]);
const vowels = new Set(["a", "e", "i", "o", "u"]);

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

/**
 * If n is not 1, will add an 's' to the string.
 *
 * @param s The string to add an 's' to.
 * @param n The number to check. If it's a boolean, will add an 's' if true.
 * @param careAboutEnding If true, will only add an 's' if the string doesn't end with an 's'. If
 *                        the string ends with an 's', it will add 'es' instead. If the string ends
 *                        with a 'y', will add 'ies' instead. Default true.
 * @returns The string with an 's' added if necessary.
 */
export function addTheS(
  s: string,
  n: number | boolean,
  careAboutEnding = true,
): string {
  if (type(n) === "boolean") {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    n = n ? 2 : 1;
  }
  if (n !== 1) {
    if (careAboutEnding) {
      const lastLetter = string.sub(s, -1);
      if (lastLetter === "s") {
        return `${s}es`;
      }
      if (lastLetter === "y") {
        return `${string.sub(s, 1, -2)}ies`;
      }
    }
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
 * Returns a string joining all elements in the array, where the last element is joined with the
 * specified string, and the rest are joined with commas.
 *
 * @param s The string to join the last element with.
 * @param arr The array to join.
 * @returns The joined string.
 *
 * @example joinWith("and", ["a", "b", "c"]) // "a, b and c".
 */
export function joinWith(s: string, arr: string[]): string {
  const len = arr.length;
  if (len === 0) {
    return "";
  }
  if (len === 1) {
    return arr[0] ?? "";
  }
  const last = arr[len - 1];
  const rest = arr.slice(0, len - 1).join(s);
  return `${rest} ${s} ${last}`;
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

/** Split a string into multiple sub-strings of equal (or near equal) length. */
export function splitString(s: string, segments: number): readonly string[] {
  const len = s.length;
  const segmentLength = math.floor(len / segments);
  const arr: string[] = [];
  for (let i = 0; i < segments; i++) {
    const start = i * segmentLength + 1;
    const end = (i + 1) * segmentLength;
    const segment = string.sub(s, start, end);
    arr.push(segment);
  }
  return arr;
}

/**
 * Adds 'a' or 'an' to the start of a string, depending on whether the first letter is a vowel. If
 * the string already starts with an article, it will not add one.
 *
 * @returns The string with an article added.
 */
export function addArticle(s: string): string {
  // Find the first word in the string.
  const firstWord = s.split(" ")[0];
  if (firstWord === undefined) {
    return s;
  }

  // If the first word is an article, we don't need to add one.
  if (articles.has(firstWord.toLowerCase())) {
    return s;
  }

  // Otherwise, check if the first letter is a vowel.
  const firstLetter = string.sub(firstWord, 1, 1);
  if (vowels.has(firstLetter.toLowerCase())) {
    return `an ${s}`;
  }

  return `a ${s}`;
}

/** Returns a string with the first letter un-capitalized. */
export function uncapitalizeFirstLetter(s: string): string {
  return string.lower(string.sub(s, 1, 1)) + string.sub(s, 2);
}
