import { Pane } from "./Pane";
import { Rect, renderspace_t, TableState } from "./types";

export function renderModule(table: TableState) {
  const pane_NE = new Pane();
  const pane_SE = new Pane();

  table.onInvalidate.add(() => {
    pane_NE.invalidate();
    pane_SE.invalidate();
  });

  table.onRender.add(() => {
    const { scrollLeft, canvasElement, scrollTop, pixelRatio, frozenHeight } = table;

    pane_NE.draw(
      table,
      new Rect<renderspace_t>(scrollLeft * pixelRatio, 0, canvasElement.width, frozenHeight),
      new Rect<renderspace_t>(0, 0, canvasElement.width, frozenHeight),
    );

    pane_SE.draw(
      table,
      new Rect<renderspace_t>(
        scrollLeft * pixelRatio,
        frozenHeight + scrollTop * pixelRatio,
        canvasElement.width,
        canvasElement.height - frozenHeight,
      ),
      new Rect<renderspace_t>(
        0,
        frozenHeight,
        canvasElement.width,
        canvasElement.height - frozenHeight,
      ),
    );
  });
}
