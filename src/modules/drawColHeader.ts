import { COL_WIDTH_PX, DEFAULT_THEME, ROW_HEIGHT_PX } from '../core/const';
import { TableCore } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";

export function drawColHeader(col: number, core: TableCore) {
  const { ctx, pixelRatio, scrollLeft } = core;
  assertNonNullishDEV(ctx);

  ctx.save();
  ctx.scale(pixelRatio, pixelRatio);
  ctx.translate(-scrollLeft, 0);
  ctx.fillStyle = DEFAULT_THEME.colheaderBackground;
  ctx.fillRect(col * COL_WIDTH_PX, 0, COL_WIDTH_PX, ROW_HEIGHT_PX);
  ctx.fillStyle = DEFAULT_THEME.colheaderForeground;
  ctx.textBaseline = "top";
  ctx.font = DEFAULT_THEME.fontString;
  ctx.fillText(String(col), col * COL_WIDTH_PX + 4, 0);
  ctx.restore();
}
