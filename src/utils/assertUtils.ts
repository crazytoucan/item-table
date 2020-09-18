export function assertNonNullishDEV<T>(
  val: T | null | undefined
): asserts val is T {
  if (val === null || val === undefined) {
    throw new Error();
  }
}
