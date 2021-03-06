import { ItemTable } from "../ItemTable";
import { setStyle } from "../utils/htmlUtils";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  setStyle(container, {
    width: "100vw",
    height: "100vh",
    overflow: "auto",
    position: "relative",
  });

  const table = new ItemTable({
    element: container,
    cellCallback: (row, col) => ({
      kind: "text",
      text: `c${row}_${col}.txt`,
    }),
  });

  const rows = [];
  for (let i = 0; i < 10000; i++) {
    rows.push(String(i));
  }

  const cols = [];
  for (let i = 0; i < 100; i++) {
    cols.push(String(i));
  }

  table.rows = rows;
  table.cols = cols;

  document.body.appendChild(container);
  table.start();
});
