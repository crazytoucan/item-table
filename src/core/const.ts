import FontMetrics from "fontmetrics";
import { Rect } from "./Rect";

export const COL_WIDTH_PX = 120;
export const ROW_HEIGHT_PX = 24;
export const DEFAULT_THEME = {
  cellPaddingBottom: 4,
  cellPaddingLeft: 10,
  cellPaddingRight: 10,
  cellPaddingTop: 4,
  colheaderBackground: "#2b2c2e",
  colheaderForeground: "#ccc",
  rowEvenBackground: "#292a2c",
  rowEvenForeground: "#dedede",
  gridline: "#444",
  rowOddBackground: "#1e1f22",
  rowOddForeground: "#dedede",
  fontFamily: "New York Medium",
  fontSize: 14,
  fontWeight: 400,
  fontString: "400 14px 'New York Medium'",
  lineHeight: 1.2,
};

export const DEFAULT_FONT_METRICS = FontMetrics({
  fontFamily: DEFAULT_THEME.fontFamily,
  fontSize: DEFAULT_THEME.fontSize,
  fontWeight: DEFAULT_THEME.fontWeight,
  origin: "top",
});

export const EMPTY_RECT = new Rect(0, 0, 0, 0);
