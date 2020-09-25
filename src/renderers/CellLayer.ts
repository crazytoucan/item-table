import { Cell } from "../core/Cell";
import { COL_WIDTH_PX, DEFAULT_THEME, ROW_HEIGHT_PX } from "../core/const";
import { Rect } from "../core/Rect";
import { ILayer, TableCore } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { clamp } from "../utils/numberUtils";
import {
  parity,
  rectContains,
  rectFromExtent,
  rectIntersect,
  rectTranslate,
} from "../utils/renderingUtils";

export class CellLayer implements ILayer {
  public render(core: TableCore, source: Rect, clean: Rect) {
    const { ctx, cellCallback, pixelRatio, rows, cols, cellRenderers } = core;
    assertNonNullishDEV(ctx);

    const cellsStartTop = ROW_HEIGHT_PX * pixelRatio;
    const cellsSource = rectIntersect(
      rectTranslate(source, 0, -cellsStartTop),
      new Rect(0, 0, Infinity, Infinity),
    );

    const minRow = clamp(
      Math.floor(cellsSource.top / pixelRatio / ROW_HEIGHT_PX),
      0,
      rows.length - 1,
    );

    const maxRow = clamp(
      Math.ceil((cellsSource.bottom - 1) / pixelRatio / ROW_HEIGHT_PX),
      0,
      rows.length - 1,
    );

    const minCol = clamp(
      Math.floor(cellsSource.left / pixelRatio / COL_WIDTH_PX),
      0,
      cols.length - 1,
    );

    const maxCol = clamp(
      Math.ceil((cellsSource.right - 1) / pixelRatio / COL_WIDTH_PX),
      0,
      cols.length - 1,
    );

    const cells = [];
    ctx.save();
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cellRect = rectFromExtent(
          Math.floor(pixelRatio * c * COL_WIDTH_PX),
          cellsStartTop + Math.floor(pixelRatio * r * ROW_HEIGHT_PX),
          Math.floor(pixelRatio * (c + 1) * COL_WIDTH_PX),
          cellsStartTop + Math.floor(pixelRatio * (r + 1) * ROW_HEIGHT_PX),
        );

        if (!rectContains(clean, cellRect)) {
          const selected = core.selection.has(r);
          ctx.fillStyle = selected
            ? DEFAULT_THEME.selectionColor
            : parity(r, DEFAULT_THEME.rowEvenBackground, DEFAULT_THEME.rowOddBackground);

          ctx.fillRect(cellRect.left, cellRect.top, cellRect.width, cellRect.height);
          cells.push(new Cell(r, c, cellCallback(rows[r], cols[c])));
        }
      }
    }

    ctx.translate(0, cellsStartTop);
    for (const renderer of cellRenderers) {
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
}
