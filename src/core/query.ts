import { ROW_HEIGHT_PX } from "./const";
import { cssspace_t, TableElement, TableState } from "./types";

export function query(table: TableState, cssX: cssspace_t, cssY: cssspace_t): TableElement | null {
  const frozenHeight = ROW_HEIGHT_PX;
  const virtualX = cssX * table.pixelRatio + table.scrollLeft * table.pixelRatio;
  const virtualY =
    cssY * table.pixelRatio < frozenHeight
      ? cssY * table.pixelRatio
      : cssY * table.pixelRatio + table.scrollTop * table.pixelRatio;

  for (const layer of table.layers) {
    const result = layer.query(table, virtualX, virtualY);
    if (result !== null) {
      return result;
    }
  }

  return null;
}
