import { Cell } from "../core/Cell";
import {
  COL_WIDTH_PX,
  DEFAULT_FONT_METRICS,
  DEFAULT_THEME,
  EMPTY_RECT,
  ROW_HEIGHT_PX,
} from "../core/const";
import { Rect } from "../core/Rect";
import { IRenderer, TableCore } from "../core/types";
import { TextCellRenderer } from "../display/TextCellRenderer";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { parity, rectContains, rectFromExtent, rectIntersect } from "../utils/renderingUtils";

function prepareFrame(
  core: TableCore,
  reuseRect: Rect,
  lastPhysicalRect: Rect,
  physicalRect: Rect,
) {
  const { canvasElement, ctx } = core;

  assertNonNullishDEV(ctx);
  if (reuseRect.width > 0 && reuseRect.height > 0) {
    ctx.drawImage(
      canvasElement,
      reuseRect.left - lastPhysicalRect.left,
      reuseRect.top - lastPhysicalRect.top,
      reuseRect.width,
      reuseRect.height,
      reuseRect.left - physicalRect.left,
      reuseRect.top - physicalRect.top,
      reuseRect.width,
      reuseRect.height,
    );
  }
}

function renderCells(core: TableCore, reuseRect: Rect, renderers: IRenderer[]) {
  const {
    cellCallback,
    cols,
    containerHeight,
    containerWidth,
    ctx,
    pixelRatio,
    rows,
    scrollLeft,
    scrollTop,
  } = core;

  assertNonNullishDEV(ctx);
  const minRow = Math.floor(scrollTop / ROW_HEIGHT_PX);
  const minCol = Math.floor(scrollLeft / COL_WIDTH_PX);
  const maxRow = Math.min(
    rows.length - 1,
    Math.ceil((scrollTop + containerHeight - 1) / ROW_HEIGHT_PX),
  );
  const maxCol = Math.min(
    cols.length - 1,
    Math.ceil((scrollLeft + containerWidth - 1) / COL_WIDTH_PX),
  );
  const cells: Cell[] = [];

  ctx.save();
  ctx.translate(-scrollLeft * pixelRatio, -scrollTop * pixelRatio);
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

  for (const renderer of renderers) {
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

export function renderModule(core: TableCore) {
  let lastPhysicalRect = EMPTY_RECT;
  const renderers = [new TextCellRenderer(DEFAULT_THEME, DEFAULT_FONT_METRICS)];

  core.onCanvasInvalidated.add(0, () => {
    lastPhysicalRect = EMPTY_RECT;
  });

  core.onRender.add(0, () => {
    const { scrollLeft, pixelRatio, canvasElement, scrollTop } = core;
    const physicalRect = new Rect(
      scrollLeft * pixelRatio,
      scrollTop * pixelRatio,
      canvasElement.width,
      canvasElement.height,
    );

    const reuseRect = rectIntersect(lastPhysicalRect, physicalRect);
    prepareFrame(core, reuseRect, lastPhysicalRect, physicalRect);
    lastPhysicalRect = physicalRect;
    renderCells(core, reuseRect, renderers);
  });
}
