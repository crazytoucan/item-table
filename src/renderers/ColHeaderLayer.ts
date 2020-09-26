import { COL_WIDTH_PX, DEFAULT_THEME, ROW_HEIGHT_PX } from "../core/const";
import { col_t, Layer, Rect, rendercoord_t, TableState } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { elementFromParentList } from "../utils/elementUtils";
import { clamp } from "../utils/numberUtils";
import { rectContains } from "../utils/renderingUtils";

export class ColHeaderLayer implements Layer {
  public render(table: TableState, source: Rect<rendercoord_t>, clean: Rect<rendercoord_t>) {
    const { ctx, userCols, pixelRatio } = table;
    assertNonNullishDEV(ctx);

    if (source.top >= ROW_HEIGHT_PX * pixelRatio) {
      return;
    }

    const minCol: col_t = clamp(
      Math.floor(source.left / pixelRatio / COL_WIDTH_PX),
      0,
      userCols.length - 1,
    );

    const maxCol: col_t = clamp(
      Math.ceil((source.right - 1) / pixelRatio / COL_WIDTH_PX),
      0,
      userCols.length - 1,
    );

    ctx.textBaseline = "top";
    ctx.font = `${DEFAULT_THEME.fontWeight} ${DEFAULT_THEME.fontSize * pixelRatio}px '${
      DEFAULT_THEME.fontFamily
    }'`;

    for (let col: col_t = minCol; col <= maxCol; col++) {
      const left = col * COL_WIDTH_PX * pixelRatio;
      const rect = new Rect<rendercoord_t>(
        left,
        0,
        COL_WIDTH_PX * pixelRatio,
        ROW_HEIGHT_PX * pixelRatio,
      );

      if (rectContains(clean, rect)) {
        continue;
      }

      ctx.fillStyle = DEFAULT_THEME.colheaderBackground;
      ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
      ctx.fillStyle = DEFAULT_THEME.gridline;
      ctx.fillRect(rect.right - 2, 3 * pixelRatio, 2, (ROW_HEIGHT_PX - 6) * pixelRatio);
      ctx.fillRect(rect.left, rect.bottom - 1, rect.width, 1);
      ctx.fillStyle = DEFAULT_THEME.colheaderForeground;
      ctx.fillText(String(col), rect.left + 24, 10);
    }
  }

  public query(table: TableState, x: rendercoord_t, y: rendercoord_t) {
    const { pixelRatio, userCols } = table;
    const col: col_t = Math.floor(x / COL_WIDTH_PX / pixelRatio);
    return y >= ROW_HEIGHT_PX * pixelRatio || col < 0 || col >= userCols.length
      ? null
      : elementFromParentList({ type: "colheader", col }, { type: "root" });
  }
}
