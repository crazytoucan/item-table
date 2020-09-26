import { order } from "../utils/numberUtils";
import { COL_WIDTH_PX, ROW_HEIGHT_PX } from "./const";
import { query } from "./query";
import { row_t, TableState } from "./types";

export function mouseModule(table: TableState) {
  const { contentElement } = table;
  const getCell = (evt: MouseEvent) => {
    const row = Math.floor((evt.offsetY - ROW_HEIGHT_PX) / ROW_HEIGHT_PX);
    const col = Math.floor(evt.offsetX / COL_WIDTH_PX);

    return row >= 0 && row < table.userRows.length && col >= 0 && col < table.userCols.length
      ? { row, col }
      : null;
  };

  contentElement.addEventListener("mousemove", (evt) => {
    let iter = query(table, evt.clientX, evt.clientY);
    while (iter !== null) {
      switch (iter.data.type) {
        case "cell":
          contentElement.setAttribute("title", `Cell_${iter.data.row}_${iter.data.col}`);
          return;
      }

      iter = iter.parent;
    }
  });

  let drag:
    | {
        startRow: row_t;
      }
    | undefined;

  function onMouseMoveWhileDown(evt: MouseEvent) {
    const cell = getCell(evt);
    if (drag === undefined || cell === null) {
      return;
    }

    const [from, to] = order(drag.startRow, cell.row);
    const selection = new Set<row_t>();
    for (let i = from; i <= to; i++) {
      selection.add(i);
    }

    table.selection = selection;
    table.onInvalidate.emit();
  }

  contentElement.addEventListener("mousedown", (evt) => {
    let iter = query(table, evt.clientX, evt.clientY);
    while (iter !== null) {
      switch (iter.data.type) {
        case "cell":
          if (evt.button === 0) {
            table.selection = new Set([iter.data.row]);
            drag = { startRow: iter.data.row };
            table.onInvalidate.emit();

            document.addEventListener("mousemove", onMouseMoveWhileDown);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", onMouseMoveWhileDown);
            });
            return;
          }
      }

      iter = iter.parent;
    }
  });
}
