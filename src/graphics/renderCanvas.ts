import { IState } from "../core/types";
import { assertNonNullishDEV } from "../utils/assertUtils";

const COL_WIDTH_PX = 120;
const ROW_HEIGHT_PX = 22;

export function renderCanvas(s: IState) {
  const ctx = s.ctx;
  assertNonNullishDEV(ctx);
  ctx.save();
  ctx.scale(s.pixelRatio, s.pixelRatio);

  ctx.textBaseline = "top";
  for (let r = 0; r < s.rows.length; r++) {
    ctx.fillStyle =
      r % 2 === 0
        ? s.theme["core.evenBackground"]
        : s.theme["core.oddBackground"];
    ctx.fillRect(0, ROW_HEIGHT_PX * r, s.canvas.width, ROW_HEIGHT_PX);
  }

  for (let r = 0; r < s.rows.length; r++) {
    for (let c = 0; c < s.cols.length; c++) {
      const x = COL_WIDTH_PX * c + s.theme["cell.padding"][3];
      const y = ROW_HEIGHT_PX * r + s.theme["cell.padding"][0];
      const cell = s.cell(s.rows[r], s.cols[c]);
      switch (cell.kind) {
        case "blank":
          // skip
          break;

        case "image":
          // skip
          break;

        case "text":
          ctx.fillStyle = s.theme["core.evenForeground"];
          ctx.fillText(cell.text, x, y);
          break;
      }
    }
  }

  ctx.restore();
}
