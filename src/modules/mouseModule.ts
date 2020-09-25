import { COL_WIDTH_PX, ROW_HEIGHT_PX } from "../core/const";
import { TableCore } from "../core/types";

export function mouseModule(core: TableCore) {
  const { contentElement } = core;
  const getCell = (evt: MouseEvent) => {
    const row = Math.floor((evt.offsetY - ROW_HEIGHT_PX) / ROW_HEIGHT_PX);
    const col = Math.floor(evt.offsetX / COL_WIDTH_PX);

    return row >= 0 && row < core.rows.length && col >= 0 && col < core.cols.length
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
        core.selection = new Set([cell.row]);
        core.onInvalidate.emit();
        core.markDirty();
      }
    }
  });
}
