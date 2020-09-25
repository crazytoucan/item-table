import { Rect } from "../core/Rect";

export function parity<T>(i: number, evenValue: T, oddValue: T) {
  return i % 2 === 0 ? evenValue : oddValue;
}

export function rectFromExtent(left: number, top: number, right: number, bottom: number) {
  return new Rect(left, top, right - left, bottom - top);
}

export function rectIntersect(a: Rect, b: Rect): Rect {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  return rectFromExtent(left, top, right, bottom);
}


export function rectTranslate(rect: Rect, tx: number, ty: number): Rect {
  return new Rect(rect.left + tx, rect.top + ty, rect.width, rect.height);
}

export function rectIntersects(a: Rect, b: Rect) {
  const intersect = rectIntersect(a, b);
  return intersect.width > 0 && intersect.height > 0;
}

export function rectContains(a: Rect, b: Rect) {
  return a.left <= b.left && a.top <= b.top && a.right >= b.right && a.bottom >= b.bottom;
}
