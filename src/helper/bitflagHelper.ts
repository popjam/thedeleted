import { getEnumValues } from "isaacscript-common";

/** Determine if a BitFlags object contains a BitFlag. */
export function bitFlagsContainsValue<T extends BitFlag>(
  bitFlagsObject: BitFlags<T>,
  value: BitFlag,
): boolean {
  return value === (bitFlagsObject & value);
}

/** Determines if the BitFlags object contains all the bitflags in an array. */
export function bitFlagsContainsAllBitflags<T extends BitFlag>(
  bitFlagsObject: BitFlags<T>,
  bitflags: BitFlag[],
): boolean {
  return bitflags.every((bitFlag) =>
    bitFlagsContainsValue(bitFlagsObject, bitFlag),
  );
}

/** Determines if the BitFlags object contains one of the bitflags in an array. */
export function bitFlagsContainsAtLeastOneBitflags<T extends BitFlag>(
  bitFlagsObject: BitFlags<T>,
  bitflags: BitFlag[],
): boolean {
  return bitflags.some((bitFlag) =>
    bitFlagsContainsValue(bitFlagsObject, bitFlag),
  );
}
