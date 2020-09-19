import { createTable as createTable } from "../duratable";
import { setStyle } from "../utils/htmlUtils";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  setStyle(container, {
    width: "300px",
    height: "300px",
  });

  const table = createTable(container);
  table.rows = ["0", "1", "2", "3"];
  table.cols = ["a", "b", "c"];
  table.cellCallback = (row, col) => ({
    kind: "text",
    text: `${row}${col}`,
  });

  document.body.appendChild(container);
});
