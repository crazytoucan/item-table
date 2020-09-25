import { Cell } from "../core/Cell";
import { COL_WIDTH_PX, DEFAULT_THEME, ROW_HEIGHT_PX } from "../core/const";
import { Rect } from "../core/Rect";
import { ILayer, TableCore } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { parity, rectContains, rectFromExtent } from "../utils/renderingUtils";

export class CellLayer implements ILayer {
  public render(core: TableCore, source: Rect, clean: Rect) {
    const { ctx, cellCallback, pixelRatio, rows, cols, cellRenderers } = core;
    assertNonNullishDEV(ctx);

    const minRow = Math.max(0, Math.floor(source.top / pixelRatio / ROW_HEIGHT_PX));
    const maxRow = Math.min(
      rows.length - 1,
      Math.ceil((source.top + source.height - 1) / pixelRatio / ROW_HEIGHT_PX),
    );

    const minCol = Math.floor(source.left / pixelRatio / COL_WIDTH_PX);
    const maxCol = Math.min(
      cols.length - 1,
      Math.ceil((source.left + source.width - 1) / pixelRatio / COL_WIDTH_PX),
    );

    const cells = [];
    for (let r = minRow; r <= maxRow; r++) {
      ctx.fillStyle = parity(r, DEFAULT_THEME.rowEvenBackground, DEFAULT_THEME.rowOddBackground);

      for (let c = minCol; c <= maxCol; c++) {
        const cellRect = rectFromExtent(
          Math.floor(pixelRatio * c * COL_WIDTH_PX),
          Math.floor(pixelRatio * r * ROW_HEIGHT_PX),
          Math.floor(pixelRatio * (c + 1) * COL_WIDTH_PX),
          Math.floor(pixelRatio * (r + 1) * ROW_HEIGHT_PX),
        );

        if (!rectContains(clean, cellRect)) {
          ctx.fillRect(cellRect.left, cellRect.top, cellRect.width, cellRect.height);
          cells.push(new Cell(r, c, cellCallback(rows[r], cols[c])));
        }
      }
    }

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
