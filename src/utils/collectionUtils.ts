export function removeFirst<T>(arr: T[], val: T) {
  const idx = arr.indexOf(val);
  if (idx !== -1) {
    arr.splice(idx, 1);
  }
}

export function upperBound(arr: ArrayLike<number>, val: number) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > val) {
      return i;
    }
  }

  return arr.length;
}
