import { ROW_HEIGHT_PX } from "./const";
import { Pane } from "./Pane";
import { Rect, rendercoord_t, TableState } from "./types";

export function renderModule(table: TableState) {
  const pane_NE = new Pane();
  const pane_SE = new Pane();

  table.onInvalidate.add(() => {
    pane_NE.invalidate();
    pane_SE.invalidate();
  });

  table.onRender.add(() => {
    const { scrollLeft, canvasElement, scrollTop, pixelRatio } = table;
    const northHeight: rendercoord_t = ROW_HEIGHT_PX * pixelRatio;

    pane_NE.draw(
      table,
      new Rect<rendercoord_t>(scrollLeft * pixelRatio, 0, canvasElement.width, northHeight),
      new Rect<rendercoord_t>(0, 0, canvasElement.width, northHeight),
    );

    pane_SE.draw(
      table,
      new Rect<rendercoord_t>(
        scrollLeft * pixelRatio,
        northHeight + scrollTop * pixelRatio,
        canvasElement.width,
        canvasElement.height - northHeight,
      ),
      new Rect<rendercoord_t>(
        0,
        northHeight,
        canvasElement.width,
        canvasElement.height - northHeight,
      ),
    );
  });
}
