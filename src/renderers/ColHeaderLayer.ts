import { COL_WIDTH_PX, DEFAULT_THEME, ROW_HEIGHT_PX } from "../core/const";
import { Rect } from "../core/Rect";
import { ILayer, TableCore } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { clamp } from "../utils/numberUtils";
import { rectContains } from "../utils/renderingUtils";

export class ColHeaderLayer implements ILayer {
  public render(core: TableCore, source: Rect, clean: Rect) {
    const { ctx, cols, pixelRatio } = core;
    assertNonNullishDEV(ctx);

    if (source.top > ROW_HEIGHT_PX * pixelRatio) {
      return;
    }

    const minCol = clamp(Math.floor(source.left / pixelRatio / COL_WIDTH_PX), 0, cols.length - 1);
    const maxCol = clamp(
      Math.ceil((source.left + source.width - 1) / pixelRatio / COL_WIDTH_PX),
      0,
      cols.length - 1,
    );

    ctx.textBaseline = "top";
    ctx.font = `${DEFAULT_THEME.fontWeight} ${DEFAULT_THEME.fontSize * pixelRatio}px '${
      DEFAULT_THEME.fontFamily
    }'`;

    for (let col = minCol; col <= maxCol; col++) {
      const left = col * COL_WIDTH_PX * pixelRatio;
      const rect = new Rect(left, 0, COL_WIDTH_PX * pixelRatio, ROW_HEIGHT_PX * pixelRatio);
      if (rectContains(clean, rect)) {
        continue;
      }

      ctx.fillStyle = DEFAULT_THEME.colheaderBackground;
      ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
      ctx.fillStyle = DEFAULT_THEME.gridline;
      ctx.fillRect(rect.left + rect.width - 2, 6, 2, 36);
      ctx.fillRect(rect.left, rect.top + rect.height - 1, rect.width, 1);
      ctx.fillStyle = DEFAULT_THEME.colheaderForeground;
      ctx.fillText(String(col), rect.left + 24, 10);
    }
  }
}
