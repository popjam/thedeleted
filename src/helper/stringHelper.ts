import {
  capitalizeFirstLetter,
  getRandomArrayElement,
} from "isaacscript-common";
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

export function capitalizeFirstLetterOfEachWord(s: string): string {
  // Split the string into words.
  const words = s.split(" ");

  // Capitalize the first letter of each word.
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word === undefined) {
      continue;
    }

    const firstLetter = word.charAt(0);
    const rest = word.slice(1);
    const capitalized = firstLetter.toUpperCase() + rest;
    words[i] = capitalized;
  }

  // Join the words back together.
  return words.join(" ");
}

/**
 * Use this function to convert 'STRINGS_LIKE_THIS' to 'strings like this'. It will also turn
 * strings 'thatAreLikeThis' to 'that are like this'.
 */

export function constantToNormalString(s: string): string {
  // First, replace the underscores with spaces.
  let normalString = string.gsub(s, "_", " ")[0];

  // Then, separate words that are likeThis.
  normalString = string.gsub(normalString, "(%l)(%u)", "%1 %2")[0];

  // Separate words and numbers.
  normalString = string.gsub(normalString, "(%l)(%d)", "%1 %2")[0];

  // Finally, lowercase the string.
  normalString = string.lower(normalString);

  // Then, capitalize the first letter of each word.
  normalString = capitalizeFirstLetterOfEachWord(normalString);

  return normalString;
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

/**
 * Combines two words by appending a prefix from the first word to a suffix from the second word.
 * The prefix is determined by finding a random split point in the first word, and the suffix is
 * determined by finding a random split point in the second word that starts with a vowel if the
 * prefix ends with a vowel, and vice versa.
 *
 * @param word1 The first word.
 * @param word2 The second word.
 * @returns The combined word.
 */
export function combineWords(word1: string, word2: string): string {
  // Randomize the order of the words.
  if (math.random() < 0.5) {
    const temp = word1;
    word1 = word2;
    word2 = temp;
  }

  // Find a prefix from word1 to append to word2.
  const splitIndexWord1 = getRandomInteger(1, word1.length - 1, undefined);
  const splitWord1 = string.sub(word1, 1, splitIndexWord1);

  // Determine if the last letter of the prefix is a vowel.
  const lastLetter = string.sub(splitWord1, -1);
  const isVowel = vowels.has(lastLetter.toLowerCase());

  // Find a random suffix from word2 which starts with a vowel if the prefix ends with a vowel, and
  // vice versa. We do this by finding all eligible split points and choosing one at random.
  const splitPoints = [] as number[];
  for (let i = 1; i < word2.length; i++) {
    const letter = string.sub(word2, i, i);
    if (isVowel !== vowels.has(letter.toLowerCase())) {
      splitPoints.push(i);
    }
  }

  // If there are no eligible split points, just choose a random one.
  const splitIndexWord2 =
    splitPoints.length === 0
      ? getRandomInteger(1, word2.length - 1, undefined)
      : getRandomArrayElement(splitPoints, undefined);
  const splitWord2 = string.sub(word2, splitIndexWord2, word2.length);

  const hybridWord = `${splitWord1}${splitWord2}`;
  return capitalizeFirstLetterOfEachWord(hybridWord.toLowerCase());
}

/**
 * Combines multiple words into a single string.
 *
 * @param words The words to be combined.
 * @returns The combined string.
 */
export function combineManyWords(...words: readonly string[]): string {
  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return words[0]!;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let combined = words[0]!;
  for (let i = 1; i < words.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    combined = combineWords(combined, words[i]!);
  }
  return combined;
}
