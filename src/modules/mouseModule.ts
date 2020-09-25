import { COL_WIDTH_PX, ROW_HEIGHT_PX } from "../core/const";
import { TableCore } from "../core/types";

export function mouseModule(core: TableCore) {
  const { contentElement } = core;
  let lastRow = -1;
  let lastCol = -1;

  core.onStart.add(() => {
    contentElement.addEventListener("mousemove", (evt) => {
      const row = Math.floor(evt.offsetY / ROW_HEIGHT_PX);
      const col = Math.floor(evt.offsetX / COL_WIDTH_PX);
      if (row !== lastRow || col !== lastCol) {
        lastRow = row;
        lastCol = col;
        contentElement.setAttribute("title", `Cell_${row}_${col}`);
      }
    });
  });
}
