export function setStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  for (const key of Object.keys(style)) {
    el.style[key as any] = style[key as any]!;
  }
}
