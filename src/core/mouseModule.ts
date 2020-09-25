import { COL_WIDTH_PX, ROW_HEIGHT_PX } from "./const";
import { TableState } from "./types";

export function mouseModule(table: TableState) {
  const { contentElement } = table;
  const getCell = (evt: MouseEvent) => {
    const row = Math.floor((evt.offsetY - ROW_HEIGHT_PX) / ROW_HEIGHT_PX);
    const col = Math.floor(evt.offsetX / COL_WIDTH_PX);

    return row >= 0 && row < table.rows.length && col >= 0 && col < table.cols.length
      ? { row, col }
      : null;
  };

  contentElement.addEventListener("mousemove", (evt) => {
    const cell = getCell(evt);
    if (cell !== null) {
      contentElement.setAttribute("title", `Cell_${cell.row}_${cell.col}`);
    }
  });

  contentElement.addEventListener("mousedown", (evt) => {
    if (evt.button === 0) {
      const cell = getCell(evt);
      if (cell !== null) {
        table.selection = new Set([cell.row]);
        table.onInvalidate.emit();
      }
    }
  });
}
