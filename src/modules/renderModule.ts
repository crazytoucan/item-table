import { Rect } from "../core/Rect";
import { TableCore } from "../core/types";
import { Pane } from "./Pane";

export function renderModule(core: TableCore) {
  const pane = new Pane(core);
  core.onCanvasInvalidated.add(() => {
    pane.invalidate();
  });

  core.onRender.add(() => {
    const { scrollLeft, canvasElement, scrollTop, pixelRatio } = core;

    pane.draw(
      new Rect(
        scrollLeft * pixelRatio,
        scrollTop * pixelRatio,
        canvasElement.width,
        canvasElement.height,
      ),
      new Rect(0, 0, canvasElement.width, canvasElement.height),
    );
  });
}
