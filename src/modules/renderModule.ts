import { Rect } from "../core/Rect";
import { TableCore } from "../core/types";
import { Pane } from "./Pane";

export function renderModule(core: TableCore) {
  const pane = new Pane(core);
  core.onCanvasInvalidated.add(() => {
    pane.invalidate();
  });

  core.onRender.add(() => {
    const { scrollLeft, canvasElement, scrollTop, containerWidth, containerHeight } = core;

    pane.draw(
      new Rect(scrollLeft, scrollTop, containerWidth, containerHeight),
      new Rect(0, 0, canvasElement.width, canvasElement.height),
    );
  });
}
