import { DEFAULT_THEME, ROW_HEIGHT_PX } from "../core/const";
import { Cell, col_t, Layer, Rect, renderspace_t, row_t, TableState } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { upperBound } from "../utils/collectionUtils";
import { elementFromParentList } from "../utils/elementUtils";
import { clamp } from "../utils/numberUtils";
import {
  parity,
  rectContains,
  rectFromExtent,
  rectIntersect,
  rectTranslate,
} from "../utils/renderingUtils";

export class CellLayer implements Layer {
  public render(table: TableState, source: Rect<renderspace_t>, clean: Rect<renderspace_t>) {
    const {
      ctx,
      pixelRatio,
      colsLeft,
      userRows,
      userCols,
      userCellCallback,
      cellRenderers,
    } = table;
    assertNonNullishDEV(ctx);

    const cellsStartTop: renderspace_t = ROW_HEIGHT_PX * pixelRatio;
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

    const minCol: col_t = clamp(upperBound(colsLeft, cellsRegion.left) - 1, 0, userCols.length - 1);

    const maxCol: col_t = clamp(
      upperBound(colsLeft, cellsRegion.right - 1) - 1,
      0,
      userCols.length - 1,
    );

    const cells = [];
    ctx.save();
    for (let r: row_t = minRow; r <= maxRow; r++) {
      for (let c: col_t = minCol; c <= maxCol; c++) {
        const cellRect = rectFromExtent(
          colsLeft[c],
          cellsStartTop + Math.floor(pixelRatio * r * ROW_HEIGHT_PX),
          colsLeft[c + 1],
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
          table,
          cells.filter((c) => c.value.kind === renderer.cellKind),
        );
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
      }
    }

    ctx.restore();
  }

  public query(table: TableState, x: renderspace_t, y: renderspace_t) {
    const { colsLeft, userCols, userRows, pixelRatio } = table;
    const cellsStartTop: renderspace_t = ROW_HEIGHT_PX * pixelRatio;
    const col: col_t = upperBound(colsLeft, x) - 1;
    const row: row_t = Math.floor((y - cellsStartTop) / ROW_HEIGHT_PX / pixelRatio);
    return row < 0 || row >= userRows.length || col < 0 || col >= userCols.length
      ? null
      : elementFromParentList({ type: "cell", col, row }, { type: "row", row }, { type: "root" });
  }
}
