import { ROW_HEIGHT_PX } from "../core/const";
import { Rect, TableState } from "../core/types";
import { Pane } from "./Pane";

export function renderModule(table: TableState) {
  const pane_NE = new Pane();
  const pane_SE = new Pane();

  table.onInvalidate.add(() => {
    pane_NE.invalidate();
    pane_SE.invalidate();
  });

  table.onRender.add(() => {
    const { scrollLeft, canvasElement, scrollTop, pixelRatio } = table;
    const northHeight = ROW_HEIGHT_PX * pixelRatio;

    pane_NE.draw(
      table,
      new Rect(scrollLeft * pixelRatio, 0, canvasElement.width, northHeight),
      new Rect(0, 0, canvasElement.width, northHeight),
    );

    pane_SE.draw(
      table,
      new Rect(
        scrollLeft * pixelRatio,
        northHeight + scrollTop * pixelRatio,
        canvasElement.width,
        canvasElement.height - northHeight,
      ),
      new Rect(0, northHeight, canvasElement.width, canvasElement.height - northHeight),
    );
  });
}
