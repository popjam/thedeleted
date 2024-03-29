import { log, logTable } from "isaacscript-common";
import { objectToString } from "./objectHelper";

export function fprint(arg: unknown): void {
  print(arg);
}

export function deepPrint(arg: unknown): void {
  const result = buildString(arg);
  fprint(result);
}

function buildString(arg: unknown, indent = ""): string {
  if (arg instanceof Map) {
    let result = `${indent}Map:\n`;
    for (const [key, value] of arg) {
      result += `${indent}  Key: ${key}, Value: ${buildString(
        value,
        `${indent}  `,
      )}\n`;
    }
    return result;
  }
  if (arg instanceof Set) {
    let result = `${indent}Set:\n`;
    for (const value of arg) {
      result += `${indent}  Value: ${buildString(value, `${indent}  `)}\n`;
    }
    return result;
  }
  if (Array.isArray(arg)) {
    let result = `${indent}Array:\n`;
    for (const [index, value] of arg.entries()) {
      result += `${indent}  Index: ${index}, Value: ${buildString(
        value,
        `${indent}  `,
      )}\n`;
    }
    return result;
  }
  if (typeof arg === "object" && arg !== null) {
    let result = `${indent}Object:\n`;
    // eslint-disable-next-line isaacscript/no-for-in
    for (const key in arg) {
      result += `${indent}  Key: ${key}, Value: ${buildString(
        (arg as Record<string, unknown>)[key],
        `${indent}  `,
      )}\n`;
    }
    return result;
  }
  return tostring(arg);
}
