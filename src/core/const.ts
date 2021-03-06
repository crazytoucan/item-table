import FontMetrics from "fontmetrics";

export const ROW_HEIGHT_PX = 19;
export const DEFAULT_THEME = {
  cellPaddingBottom: 3,
  cellPaddingLeft: 10,
  cellPaddingRight: 10,
  cellPaddingTop: 3,
  colheaderBackground: "#2b2c2e",
  colheaderForeground: "#ccc",
  rowEvenBackground: "#292a2c",
  rowEvenForeground: "#dedede",
  selectionColor: "#0457d0",
  colheaderHeight: 23,
  gridline: "#444",
  rowOddBackground: "#1e1f22",
  rowOddForeground: "#dedede",
  fontFamily: "system-ui",
  fontSize: 11,
  fontWeight: 400,
  fontString: "400 12px 'system-ui'",
  lineHeight: 1.1,
};

export const DEFAULT_FONT_METRICS = FontMetrics({
  fontFamily: DEFAULT_THEME.fontFamily,
  fontSize: DEFAULT_THEME.fontSize,
  fontWeight: DEFAULT_THEME.fontWeight,
  origin: "top",
});
