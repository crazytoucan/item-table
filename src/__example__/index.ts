import { NimbleTable } from "../NimbleTable";
import { setStyle } from "../utils/htmlUtils";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  setStyle(container, {
    width: "100vw",
    height: "100vh",
  });

  const table = new NimbleTable({
    element: container,
    cellCallback: (row, col) => ({
      kind: "text",
      text: `${row}${col}xy`,
    }),
  });

  const rows = [];
  for (let i = 0; i < 100; i++) {
    rows.push(String(i));
  }

  const cols = [];
  for (let i = 0; i < 10; i++) {
    cols.push(String(i));
  }

  table.rows = rows;
  table.cols = cols;

  document.body.appendChild(container);
  table.start();
});
