import { COL_WIDTH_PX, DEFAULT_THEME, ROW_HEIGHT_PX } from "../core/const";
import { Cell, col_t, Layer, Rect, rendercoord_t, row_t, TableState } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { clamp } from "../utils/numberUtils";
import {
  parity,
  rectContains,
  rectFromExtent,
  rectIntersect,
  rectTranslate,
} from "../utils/renderingUtils";

export class CellLayer implements Layer {
  public render(table: TableState, source: Rect<rendercoord_t>, clean: Rect<rendercoord_t>) {
    const { ctx, pixelRatio, userRows, userCols, userCellCallback, cellRenderers } = table;
    assertNonNullishDEV(ctx);

    const cellsStartTop: rendercoord_t = ROW_HEIGHT_PX * pixelRatio;
    const cellsRegion = rectTranslate(
      rectIntersect(source, new Rect(0, cellsStartTop, Infinity, Infinity)),
      0,
      -cellsStartTop,
    );

    const minRow: row_t = clamp(
      Math.floor(cellsRegion.top / pixelRatio / ROW_HEIGHT_PX),
      0,
      userRows.length - 1,
    );

    const maxRow: row_t = clamp(
      Math.ceil((cellsRegion.bottom - 1) / pixelRatio / ROW_HEIGHT_PX),
      0,
      userRows.length - 1,
    );

    const minCol: col_t = clamp(
      Math.floor(cellsRegion.left / pixelRatio / COL_WIDTH_PX),
      0,
      userCols.length - 1,
    );

    const maxCol: col_t = clamp(
      Math.ceil((cellsRegion.right - 1) / pixelRatio / COL_WIDTH_PX),
      0,
      userCols.length - 1,
    );

    const cells = [];
    ctx.save();
    for (let r: row_t = minRow; r <= maxRow; r++) {
      for (let c: col_t = minCol; c <= maxCol; c++) {
        const cellRect = rectFromExtent(
          Math.floor(pixelRatio * c * COL_WIDTH_PX),
          cellsStartTop + Math.floor(pixelRatio * r * ROW_HEIGHT_PX),
          Math.floor(pixelRatio * (c + 1) * COL_WIDTH_PX),
          cellsStartTop + Math.floor(pixelRatio * (r + 1) * ROW_HEIGHT_PX),
        );

        if (!rectContains(clean, cellRect)) {
          const selected = table.selection.has(r);
          const rowStripeColor = parity(
            r,
            DEFAULT_THEME.rowEvenBackground,
            DEFAULT_THEME.rowOddBackground,
          );

          ctx.fillStyle = selected ? DEFAULT_THEME.selectionColor : rowStripeColor;
          ctx.fillRect(cellRect.left, cellRect.top, cellRect.width, cellRect.height);
          ctx.fillStyle = rowStripeColor;
          ctx.fillRect(cellRect.left, cellRect.bottom - 2, cellRect.width, 2);
          cells.push(new Cell(r, c, userCellCallback(userRows[r], userCols[c])));
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
        // tslint:disable-next-line:no-console
        console.error(e);
      }
    }

    ctx.restore();
  }
}
