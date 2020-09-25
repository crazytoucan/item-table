import { Cell } from "../core/Cell";
import { COL_WIDTH_PX, DEFAULT_THEME, EMPTY_RECT, ROW_HEIGHT_PX } from "../core/const";
import { Rect } from "../core/Rect";
import { TableCore } from "../core/types";
import { assertEqualsDEV, assertNonNullishDEV } from "../utils/assertUtils";
import { parity, rectContains, rectFromExtent, rectIntersect } from "../utils/renderingUtils";

function renderCells(core: TableCore, source: Rect, dest: Rect, reuseRect: Rect) {
  const { cellCallback, cols, ctx, pixelRatio, rows } = core;

  assertNonNullishDEV(ctx);
  const minRow = Math.floor(source.top / ROW_HEIGHT_PX);
  const minCol = Math.floor(source.left / COL_WIDTH_PX);
  const maxRow = Math.min(
    rows.length - 1,
    Math.ceil((source.top + source.height - 1) / ROW_HEIGHT_PX),
  );
  const maxCol = Math.min(
    cols.length - 1,
    Math.ceil((source.left + source.width - 1) / COL_WIDTH_PX),
  );

  const cells: Cell[] = [];
  // for (let col = minCol; col <= maxCol; col++) {
  //   drawColHeader(col, core);
  // }

  ctx.save();
  ctx.beginPath();
  ctx.rect(dest.left, dest.top, dest.width, dest.height);
  ctx.clip();
  ctx.translate(-source.left * pixelRatio + dest.left, -source.top * pixelRatio + dest.top);
  for (let r = minRow; r <= maxRow; r++) {
    ctx.fillStyle = parity(r, DEFAULT_THEME.rowEvenBackground, DEFAULT_THEME.rowOddBackground);

    for (let c = minCol; c <= maxCol; c++) {
      const cellRect = rectFromExtent(
        Math.floor(pixelRatio * c * COL_WIDTH_PX),
        Math.floor(pixelRatio * r * ROW_HEIGHT_PX),
        Math.floor(pixelRatio * (c + 1) * COL_WIDTH_PX),
        Math.floor(pixelRatio * (r + 1) * ROW_HEIGHT_PX),
      );

      if (!rectContains(reuseRect, cellRect)) {
        ctx.fillRect(cellRect.left, cellRect.top, cellRect.width, cellRect.height);
        cells.push(new Cell(r, c, cellCallback(rows[r], cols[c])));
      }
    }
  }

  for (const renderer of core.renderers) {
    try {
      renderer.render(
        cells.filter((c) => c.value.kind === renderer.cellKind),
        {
          ctx,
          pixelRatio,
        },
      );
    } catch (e) {
      console.error(e);
    }
  }

  ctx.restore();
}

export class Pane {
  private lastDstRect = EMPTY_RECT;
  private lastPhysicalRect = EMPTY_RECT;
  constructor(private core: TableCore) {}

  invalidate() {
    this.lastPhysicalRect = EMPTY_RECT;
    this.lastDstRect = EMPTY_RECT;
  }

  draw(source: Rect, dest: Rect) {
    const reuseRect = this.transferExistingPixelsIfPossible(source, dest);
    renderCells(this.core, source, dest, reuseRect);
    this.lastPhysicalRect = EMPTY_RECT;
  }

  private transferExistingPixelsIfPossible(source: Rect, dest: Rect) {
    const { canvasElement, ctx, pixelRatio } = this.core;
    const physicalRect = new Rect(
      source.left * pixelRatio,
      source.top * pixelRatio,
      source.width * pixelRatio,
      source.height * pixelRatio,
    );

    assertEqualsDEV(physicalRect.width, dest.width);
    assertEqualsDEV(physicalRect.height, dest.height);

    const reuseRect = rectIntersect(this.lastPhysicalRect, physicalRect);
    assertNonNullishDEV(ctx);

    if (reuseRect.width > 0 && reuseRect.height > 0) {
      ctx.drawImage(
        canvasElement,
        this.lastDstRect.left + reuseRect.left - this.lastPhysicalRect.left,
        this.lastDstRect.top + reuseRect.top - this.lastPhysicalRect.top,
        reuseRect.width,
        reuseRect.height,
        dest.left + reuseRect.left - physicalRect.left,
        dest.top + reuseRect.top - physicalRect.top,
        reuseRect.width,
        reuseRect.height,
      );
    }

    this.lastDstRect = dest;
    this.lastPhysicalRect = physicalRect;
    return reuseRect;
  }
}
