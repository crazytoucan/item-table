export function clamp(val: number, low: number, high: number) {
  return val < low ? low : val > high ? high : val;
}
