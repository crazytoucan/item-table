export function parity<T>(i: number, evenValue: T, oddValue: T) {
  return i % 2 === 0 ? evenValue : oddValue;
}
