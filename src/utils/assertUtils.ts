export function assertNonNullishDEV<T>(
  val: T | null | undefined
): asserts val is T {
  if (val === null || val === undefined) {
    throw new Error();
  }
}

export function assertEqualsDEV<T>(a: T, b: T) {
  if (a !== b) {
    throw new Error();
  }
}
