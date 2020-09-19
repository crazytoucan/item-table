import { IState } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { parity } from "../utils/renderingUtils";

const COL_WIDTH_PX = 120;

export function renderCanvas(s: IState) {
  const ctx = s.ctx;
  assertNonNullishDEV(ctx);
  ctx.save();
  ctx.scale(s.pixelRatio, s.pixelRatio);

  const boxHeight = Math.ceil(s.theme.lineHeight * s.theme.fontSize);
  const rowHeight = boxHeight + s.theme.cellPaddingTop + s.theme.cellPaddingBottom;
  ctx.textBaseline = "top";
  for (let r = 0; r < s.rows.length; r++) {
    ctx.fillStyle = parity(
      r,
      s.theme.rowEvenBackground,
      s.theme.rowOddBackground
    );

    ctx.fillRect(0, r * rowHeight, s.canvas.width, rowHeight);
  }

  for (let r = 0; r < s.rows.length; r++) {
    for (let c = 0; c < s.cols.length; c++) {
      const x = COL_WIDTH_PX * c + s.theme.cellPaddingLeft;
      const fontBox = s.fontMetrics.bottom - s.fontMetrics.top;
      const baseline = r * rowHeight + s.theme.cellPaddingTop + 0.5 * fontBox * s.theme.fontSize;
      const cell = s.cell(s.rows[r], s.cols[c]);
      const foreground = parity(
        r,
        s.theme.rowEvenForeground,
        s.theme.rowOddForeground
      );

      switch (cell.kind) {
        case "blank":
          // skip
          break;

        case "image":
          // skip
          break;

        case "text":
          ctx.textBaseline = "alphabetic";
          ctx.fillStyle = foreground;
          ctx.fillText(cell.text, x, baseline + 6);
          break;
      }
    }
  }

  ctx.restore();
}
