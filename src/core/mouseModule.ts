import { order } from "../utils/numberUtils";
import { query } from "./query";
import { row_t, TableState } from "./types";

export function mouseModule(table: TableState) {
  const { contentElement } = table;
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
    if (drag === undefined) {
      return;
    }

    let iter = query(table, evt.clientX, evt.clientY);
    while (iter !== null) {
      switch (iter.data.type) {
        case "cell":
          const [from, to] = order(drag.startRow, iter.data.row);
          const selection = new Set<row_t>();
          for (let i = from; i <= to; i++) {
            selection.add(i);
          }

          table.selection = selection;
          table.onInvalidate.emit();
          break;
      }

      iter = iter.parent;
    }
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
          }
          break;
      }

      iter = iter.parent;
    }
  });
}
