import { COL_WIDTH_PX, ROW_HEIGHT_PX } from "../core/const";
import { TableCore } from "../core/types";
import { setStyle } from "../utils/htmlUtils";

export function layoutModule(core: TableCore) {
  const { canvasElement, containerElement, canvasContainerElement, contentElement } = core;
  const observer = new ResizeObserver(() => {
    core.onResize.emit();
    core.markDirty();
  });

  setStyle(contentElement, {
    position: "absolute",
    top: "0",
    left: "0",
  });

  setStyle(canvasContainerElement, {
    position: "sticky",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  });

  setStyle(canvasElement, {
    pointerEvents: "none",
  });

  canvasContainerElement.appendChild(canvasElement);

  function onScroll() {
    core.scrollLeft = containerElement.scrollLeft;
    core.scrollTop = containerElement.scrollTop;
    core.markDirty();
  }

  core.onStart.add(() => {
    containerElement.addEventListener("scroll", onScroll);
    observer.observe(containerElement);
    containerElement.appendChild(canvasContainerElement);
    containerElement.appendChild(contentElement);
  });

  core.onBeforeRender.add(() => {
    core.containerWidth = core.containerElement.clientWidth;
    core.containerHeight = core.containerElement.clientHeight;
    core.pixelRatio = devicePixelRatio;
    setStyle(core.contentElement, {
      width: `${COL_WIDTH_PX * core.cols.length}px`,
      height: `${ROW_HEIGHT_PX * core.rows.length}px`,
    });

    const physicalWidth = core.containerWidth * core.pixelRatio;
    const physicalHeight = core.containerHeight * core.pixelRatio;
    if (
      core.canvasElement.width !== physicalWidth ||
      core.canvasElement.height !== physicalHeight ||
      core.canvasElement.clientWidth !== core.containerWidth ||
      core.canvasElement.clientHeight !== core.containerHeight
    ) {
      core.canvasElement.width = physicalWidth;
      core.canvasElement.height = physicalHeight;
      setStyle(core.canvasElement, {
        width: `${core.containerWidth}px`,
        height: `${core.containerHeight}px`,
      });

      core.ctx = null;
      core.onInvalidate.emit();
    }

    if (core.ctx === null) {
      core.ctx = core.canvasElement.getContext("2d", { alpha: false });
    }
  });

  core.onDispose.add(() => {
    canvasContainerElement.remove();
    contentElement.remove();
    observer.disconnect();
    containerElement.removeEventListener("scroll", onScroll);
  });
}
