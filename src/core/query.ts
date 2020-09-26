import { cssspace_t, TableElement, TableState } from "./types";

export function query(table: TableState, cssX: cssspace_t, cssY: cssspace_t): TableElement | null {
  const deviceY = cssY * table.pixelRatio;
  const virtualX = cssX * table.pixelRatio + table.scrollLeft * table.pixelRatio;
  const virtualY =
    deviceY < table.frozenHeight
      ? deviceY
      : deviceY + table.scrollTop * table.pixelRatio;

  for (const layer of table.layers) {
    const result = layer.query(table, virtualX, virtualY);
    if (result !== null) {
      return result;
    }
  }

  return null;
}
