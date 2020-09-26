import { COL_WIDTH_PX, ROW_HEIGHT_PX } from "./const";
import { TableState } from "./types";
import { setStyle } from "../utils/htmlUtils";

export function layoutModule(t: TableState) {
  const observer = new ResizeObserver(() => {
    t.onResize.emit();
  });

  setStyle(t.contentElement, {
    position: "absolute",
    top: "0",
    left: "0",
  });

  setStyle(t.canvasContainerElement, {
    position: "sticky",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  });

  setStyle(t.canvasElement, {
    pointerEvents: "none",
  });

  t.canvasContainerElement.appendChild(t.canvasElement);

  function onScroll() {
    t.scrollLeft = t.containerElement.scrollLeft;
    t.scrollTop = t.containerElement.scrollTop;
    t.onDirty.emit();
  }

  t.onStart.add(() => {
    t.containerElement.addEventListener("scroll", onScroll);
    observer.observe(t.containerElement);
    t.containerElement.appendChild(t.canvasContainerElement);
    t.containerElement.appendChild(t.contentElement);
  });

  t.onBeforeRender.add(() => {
    t.containerWidth = t.containerElement.clientWidth;
    t.containerHeight = t.containerElement.clientHeight;
    t.pixelRatio = devicePixelRatio;
    setStyle(t.contentElement, {
      width: `${COL_WIDTH_PX * t.userCols.length}px`,
      height: `${ROW_HEIGHT_PX * t.userRows.length}px`,
    });

    const physicalWidth = t.containerWidth * t.pixelRatio;
    const physicalHeight = t.containerHeight * t.pixelRatio;
    if (
      t.canvasElement.width !== physicalWidth ||
      t.canvasElement.height !== physicalHeight ||
      t.canvasElement.clientWidth !== t.containerWidth ||
      t.canvasElement.clientHeight !== t.containerHeight
    ) {
      t.canvasElement.width = physicalWidth;
      t.canvasElement.height = physicalHeight;
      setStyle(t.canvasElement, {
        width: `${t.containerWidth}px`,
        height: `${t.containerHeight}px`,
      });

      t.ctx = null;
      t.onInvalidate.emit();
    }

    if (t.ctx === null) {
      t.ctx = t.canvasElement.getContext("2d", { alpha: false });
    }
  });

  t.onDispose.add(() => {
    t.canvasContainerElement.remove();
    t.contentElement.remove();
    observer.disconnect();
    t.containerElement.removeEventListener("scroll", onScroll);
  });
}
