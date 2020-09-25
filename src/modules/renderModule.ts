import { ROW_HEIGHT_PX } from "../core/const";
import { Rect } from "../core/Rect";
import { TableCore } from "../core/types";
import { Pane } from "./Pane";

export function renderModule(core: TableCore) {
  const pane_NE = new Pane(core);
  const pane_SE = new Pane(core);

  core.onCanvasInvalidated.add(() => {
    pane_NE.invalidate();
    pane_SE.invalidate();
  });

  core.onRender.add(() => {
    const { scrollLeft, canvasElement, scrollTop, pixelRatio } = core;
    const northHeight = ROW_HEIGHT_PX * pixelRatio;

    pane_NE.draw(
      new Rect(scrollLeft * pixelRatio, 0, canvasElement.width, northHeight),
      new Rect(0, 0, canvasElement.width, northHeight),
    );

    pane_SE.draw(
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
