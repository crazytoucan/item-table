import { DEFAULT_FONT_METRICS, DEFAULT_THEME, ROW_HEIGHT_PX } from "../core/const";
import { Cell, CellRenderer, cssspace_t, renderspace_t, TableState } from "../core/types";
import { ICell_Text } from "../types";
import { assertNonNullishDEV } from "../utils/assertUtils";
import { parity } from "../utils/renderingUtils";

export class TextCellRenderer implements CellRenderer {
  public cellKind = "text" as const;
  public render(table: TableState, cells: Cell[]) {
    const { colsLeft, ctx, pixelRatio } = table;
    assertNonNullishDEV(ctx);

    const { baseline } = DEFAULT_FONT_METRICS;
    const {
      fontSize,
      cellPaddingLeft,
      cellPaddingTop,
      lineHeight,
      rowEvenForeground,
      rowOddForeground,
    } = DEFAULT_THEME;

    ctx.save();
    ctx.textBaseline = "alphabetic";
    ctx.font = `${DEFAULT_THEME.fontWeight} ${DEFAULT_THEME.fontSize * pixelRatio}px '${
      DEFAULT_THEME.fontFamily
    }'`;

    for (const { row, col, value } of cells) {
      const textValue = value as ICell_Text;
      const x: renderspace_t = colsLeft[col] + cellPaddingLeft * pixelRatio;
      const lineOffset: cssspace_t = fontSize * (baseline * lineHeight);
      const y: renderspace_t = pixelRatio * (row * ROW_HEIGHT_PX + cellPaddingTop + lineOffset);
      const foreground = parity(row, rowEvenForeground, rowOddForeground);

      ctx.fillStyle = foreground;
      ctx.fillText(textValue.text, x, y);
    }

    ctx.restore();
  }
}
