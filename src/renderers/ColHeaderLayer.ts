import { DEFAULT_THEME } from "../core/const";
import { col_t, Layer, Rect, renderspace_t, TableState } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { upperBound } from "../utils/collectionUtils";
import { elementFromParentList } from "../utils/elementUtils";
import { clamp } from "../utils/numberUtils";
import { rectContains } from "../utils/renderingUtils";

export class ColHeaderLayer implements Layer {
  public render(table: TableState, source: Rect<renderspace_t>, clean: Rect<renderspace_t>) {
    const { colsLeft, ctx, userCols, pixelRatio } = table;
    assertNonNullishDEV(ctx);

    if (source.top >= DEFAULT_THEME.colheaderHeight * pixelRatio) {
      return;
    }

    const minCol: col_t = clamp(upperBound(colsLeft, source.left) - 1, 0, userCols.length - 1);
    const maxCol: col_t = clamp(upperBound(colsLeft, source.right - 1) - 1, 0, userCols.length - 1);

    ctx.textBaseline = "middle";
    ctx.font = `${DEFAULT_THEME.fontWeight} ${DEFAULT_THEME.fontSize * pixelRatio}px '${
      DEFAULT_THEME.fontFamily
    }'`;

    for (let col: col_t = minCol; col <= maxCol; col++) {
      const rect = new Rect<renderspace_t>(
        colsLeft[col],
        0,
        colsLeft[col + 1] - colsLeft[col],
        DEFAULT_THEME.colheaderHeight * pixelRatio,
      );

      if (rectContains(clean, rect)) {
        continue;
      }

      ctx.fillStyle = DEFAULT_THEME.colheaderBackground;
      ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
      ctx.fillStyle = DEFAULT_THEME.gridline;
      ctx.fillRect(
        rect.right - 2,
        3 * pixelRatio,
        2,
        (DEFAULT_THEME.colheaderHeight - 6) * pixelRatio,
      );
      ctx.fillRect(rect.left, rect.bottom - 1, rect.width, 1);
      ctx.fillStyle = DEFAULT_THEME.colheaderForeground;
      ctx.fillText(String(col), rect.left + 24, (DEFAULT_THEME.colheaderHeight * pixelRatio) / 2);
    }
  }

  public query(table: TableState, x: renderspace_t, y: renderspace_t) {
    const { colsLeft, pixelRatio, userCols } = table;
    const col: col_t = upperBound(colsLeft, x) - 1;
    return y >= DEFAULT_THEME.colheaderHeight * pixelRatio || col < 0 || col >= userCols.length
      ? null
      : elementFromParentList({ type: "colheader", col }, { type: "root" });
  }
}
