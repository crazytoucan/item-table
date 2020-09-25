import { EMPTY_RECT } from "../core/const";
import { Rect } from "../core/Rect";
import { TableCore } from "../core/types";
import { assertEqualsDEV, assertNonNullishDEV } from "../utils/assertUtils";
import { rectIntersect } from "../utils/renderingUtils";

export class Pane {
  private lastDest = EMPTY_RECT;
  private lastSource = EMPTY_RECT;
  constructor(private core: TableCore) {}

  invalidate() {
    this.lastSource = EMPTY_RECT;
    this.lastDest = EMPTY_RECT;
  }

  draw(source: Rect, dest: Rect) {
    const { ctx } = this.core;
    assertNonNullishDEV(ctx);

    const clean = this.transferExistingPixelsIfPossible(source, dest);
    ctx.save();
    ctx.translate(-source.left + dest.left, -source.top + dest.top);
    for (const layer of this.core.layers) {
      layer.render(this.core, source, clean);
    }
    ctx.restore();
  }

  private transferExistingPixelsIfPossible(source: Rect, dest: Rect) {
    const { canvasElement, ctx } = this.core;
    assertEqualsDEV(source.width, dest.width);
    assertEqualsDEV(source.height, dest.height);

    const cleanRect = rectIntersect(this.lastSource, source);
    assertNonNullishDEV(ctx);

    if (cleanRect.width > 0 && cleanRect.height > 0) {
      ctx.drawImage(
        canvasElement,
        this.lastDest.left + cleanRect.left - this.lastSource.left,
        this.lastDest.top + cleanRect.top - this.lastSource.top,
        cleanRect.width,
        cleanRect.height,
        dest.left + cleanRect.left - source.left,
        dest.top + cleanRect.top - source.top,
        cleanRect.width,
        cleanRect.height,
      );
    }

    this.lastDest = dest;
    this.lastSource = source;
    return cleanRect;
  }
}
