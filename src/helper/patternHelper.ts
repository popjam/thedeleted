export function patternToPlainString(pattern: string): string {
  return string.gsub(pattern, "[%^%$%(%)%%%.%[%]%*%+%-%?]", "%%%1")[0];
}
