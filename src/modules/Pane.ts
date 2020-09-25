import { Rect, TableState } from "../core/types";
import { assertEqualsDEV, assertNonNullishDEV } from "../utils/assertUtils";
import { rectEmpty, rectIntersect } from "../utils/renderingUtils";

export class Pane {
  private lastDest = rectEmpty();
  private lastSource = rectEmpty();

  invalidate() {
    this.lastSource = rectEmpty();
    this.lastDest = rectEmpty();
  }

  draw(table: TableState, source: Rect, dest: Rect) {
    const { ctx } = table;
    assertNonNullishDEV(ctx);

    const clean = this.transferExistingPixelsIfPossible(table, source, dest);
    ctx.save();
    ctx.beginPath();
    ctx.rect(dest.left, dest.top, dest.width, dest.height);
    ctx.clip();
    ctx.translate(-source.left + dest.left, -source.top + dest.top);
    for (const layer of table.layers) {
      layer.render(table, source, clean);
    }

    ctx.restore();
  }

  private transferExistingPixelsIfPossible(table: TableState, source: Rect, dest: Rect) {
    const { canvasElement, ctx } = table;
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
