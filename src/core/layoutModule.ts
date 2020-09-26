import { setStyle } from "../utils/htmlUtils";
import { DEFAULT_THEME, ROW_HEIGHT_PX } from "./const";
import { renderspace_t, TableState } from "./types";

function computeRenderspaceLayout(table: TableState) {
  if (table.colsLeft.length !== table.userCols.length + 1) {
    table.colsLeft = new Int32Array(table.userCols.length + 1);
  }

  const { userCols, colsLeft, pixelRatio, userColWidths } = table;
  let x: renderspace_t = 0;
  for (let i = 0, len = userCols.length; i < len; i++) {
    const widthPx = userColWidths.get(userCols[i]) ?? 80;
    colsLeft[i] = Math.floor(x);
    x += widthPx * pixelRatio;
  }

  colsLeft[userCols.length] = Math.floor(x);
  table.frozenHeight = Math.floor(table.pixelRatio * DEFAULT_THEME.colheaderHeight);
}

export function layoutModule(table: TableState) {
  const observer = new ResizeObserver(() => {
    table.onResize.emit();
  });

  setStyle(table.contentElement, {
    position: "absolute",
    top: "0",
    left: "0",
  });

  setStyle(table.canvasContainerElement, {
    position: "sticky",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  });

  setStyle(table.canvasElement, {
    pointerEvents: "none",
  });

  table.canvasContainerElement.appendChild(table.canvasElement);

  function onScroll() {
    table.scrollLeft = table.containerElement.scrollLeft;
    table.scrollTop = table.containerElement.scrollTop;
    table.onDirty.emit();
  }

  table.onStart.add(() => {
    table.containerElement.addEventListener("scroll", onScroll);
    observer.observe(table.containerElement);
    table.containerElement.appendChild(table.canvasContainerElement);
    table.containerElement.appendChild(table.contentElement);
  });

  table.onBeforeRender.add(() => {
    table.containerWidth = table.containerElement.clientWidth;
    table.containerHeight = table.containerElement.clientHeight;
    table.pixelRatio = devicePixelRatio;
    computeRenderspaceLayout(table);

    setStyle(table.contentElement, {
      width: `${table.colsLeft[table.userCols.length] / devicePixelRatio}px`,
      height: `${DEFAULT_THEME.colheaderHeight + ROW_HEIGHT_PX * table.userRows.length}px`,
    });

    const physicalWidth = table.containerWidth * table.pixelRatio;
    const physicalHeight = table.containerHeight * table.pixelRatio;
    if (
      table.canvasElement.width !== physicalWidth ||
      table.canvasElement.height !== physicalHeight ||
      table.canvasElement.clientWidth !== table.containerWidth ||
      table.canvasElement.clientHeight !== table.containerHeight
    ) {
      table.canvasElement.width = physicalWidth;
      table.canvasElement.height = physicalHeight;
      setStyle(table.canvasElement, {
        width: `${table.containerWidth}px`,
        height: `${table.containerHeight}px`,
      });

      table.ctx = null;
      table.onInvalidate.emit();
    }

    if (table.ctx === null) {
      table.ctx = table.canvasElement.getContext("2d", { alpha: false });
    }
  });

  table.onDispose.add(() => {
    table.canvasContainerElement.remove();
    table.contentElement.remove();
    observer.disconnect();
    table.containerElement.removeEventListener("scroll", onScroll);
  });
}
