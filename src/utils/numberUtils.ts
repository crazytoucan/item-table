export function clamp(val: number, low: number, high: number) {
  return val < low ? low : val > high ? high : val;
}

export function order(a: number, b: number) {
  return a < b ? ([a, b] as const) : ([b, a] as const);
}
