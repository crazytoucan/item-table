import { IFontMetrics } from "fontmetrics";
import { Cell } from "../core/Cell";
import { COL_WIDTH_PX, DEFAULT_THEME, ROW_HEIGHT_PX } from "../core/const";
import { IRenderContext, IRenderer } from "../core/types";
import { ICell_Text } from "../types";
import { parity } from "../utils/renderingUtils";

export class TextCellRenderer implements IRenderer {
  public cellKind = "text" as const;
  constructor(private theme: typeof DEFAULT_THEME, private fontMetrics: IFontMetrics) {}

  public render(cells: Cell[], { ctx, pixelRatio }: IRenderContext) {
    const { baseline } = this.fontMetrics;
    const {
      fontSize,
      cellPaddingLeft,
      cellPaddingTop,
      lineHeight,
      rowEvenForeground,
      fontString,
      rowOddForeground,
    } = this.theme;

    ctx.save();
    ctx.scale(pixelRatio, pixelRatio);
    ctx.textBaseline = "alphabetic";
    ctx.font = fontString;
    for (const { row, col, value } of cells) {
      const textValue = value as ICell_Text;
      const x = COL_WIDTH_PX * col + cellPaddingLeft;
      const lineOffset = fontSize * (baseline * lineHeight);
      const foreground = parity(row, rowEvenForeground, rowOddForeground);

      ctx.fillStyle = foreground;
      ctx.fillText(textValue.text, x, row * ROW_HEIGHT_PX + cellPaddingTop + lineOffset);
    }

    ctx.restore();
  }
}
