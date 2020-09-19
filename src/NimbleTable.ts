import FontMetrics from "fontmetrics";
import { Cell } from "./core/Cell";
import { COL_WIDTH_PX, DEFAULT_THEME, EMPTY_RECT, ROW_HEIGHT_PX } from "./core/const";
import { Rect } from "./core/Rect";
import { IRenderer, IState } from "./core/types";
import { TextCellRenderer } from "./display/TextCellRenderer";
import { ICellCallback } from "./types";
import { assertNonNullishDEV } from "./utils/assertUtils";
import { setStyle } from "./utils/htmlUtils";
import { raf } from "./utils/raf";
import { parity, rectContains, rectFromExtent, rectIntersect } from "./utils/renderingUtils";

export interface INimbleTableOptions {
  element: HTMLElement;
  cellCallback: ICellCallback;
}

export class NimbleTable {
  private state: IState;
  private resizeObserver!: ResizeObserver;
  private lastPhysicalRect = EMPTY_RECT;
  private renderers: IRenderer[];

  constructor({ cellCallback, element }: INimbleTableOptions) {
    const canvasContainerElement = document.createElement("div");
    const canvasElement = document.createElement("canvas");
    const scrollContentElement = document.createElement("div");
    setStyle(scrollContentElement, {
      position: "absolute",
      top: "0",
      left: "0",
      pointerEvents: "none",
    });

    setStyle(canvasContainerElement, {
      position: "sticky",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    });

    canvasContainerElement.appendChild(canvasElement);
    this.state = {
      canvasElement,
      canvasContainerElement,
      cellCallback,
      cols: [],
      containerElement: element,
      containerHeight: 0,
      containerWidth: 0,
      ctx: null,
      modelHeight: 0,
      modelWidth: 0,
      pixelRatio: 0,
      rows: [],
      scrollContentElement,
      scrollLeft: 0,
      scrollTop: 0,
      theme: DEFAULT_THEME,
      fontMetrics: FontMetrics({
        fontFamily: DEFAULT_THEME.fontFamily,
        fontSize: DEFAULT_THEME.fontSize,
        fontWeight: DEFAULT_THEME.fontWeight,
        origin: "top",
      }),
    };

    this.renderers = [new TextCellRenderer(DEFAULT_THEME, this.state.fontMetrics)];
  }

  public start() {
    const s = this.state;
    s.containerElement.appendChild(s.canvasContainerElement);
    s.containerElement.appendChild(s.scrollContentElement);

    setStyle(s.containerElement, {
      overflow: "auto",
      position: "relative",
    });

    s.containerElement.addEventListener("scroll", () => {
      s.scrollLeft = s.containerElement.scrollLeft;
      s.scrollTop = s.containerElement.scrollTop;
      this.render.flush();
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.render.schedule();
    });

    this.resizeObserver.observe(s.containerElement);
    this.render.schedule();
  }

  set cols(cols: string[]) {
    this.state.cols = cols;
    this.render.schedule();
  }

  set rows(rows: string[]) {
    this.state.rows = rows;
    this.render.schedule();
  }

  removeListener() {
    // noop
  }

  flush() {
    this.render.flush();
  }

  addListener() {
    // noop
  }

  dispose() {
    const s = this.state;
    this.resizeObserver.disconnect();
    s.containerElement.removeChild(s.canvasElement);
  }

  private render = raf(() => {
    const s = this.state;
    s.containerWidth = s.containerElement.clientWidth;
    s.containerHeight = s.containerElement.clientHeight;
    s.pixelRatio = devicePixelRatio;
    setStyle(s.scrollContentElement, {
      width: `${COL_WIDTH_PX * s.cols.length}px`,
      height: `${ROW_HEIGHT_PX * s.rows.length}px`,
    });

    const physicalWidth = s.containerWidth * s.pixelRatio;
    const physicalHeight = s.containerHeight * s.pixelRatio;
    if (
      s.canvasElement.width !== physicalWidth ||
      s.canvasElement.height !== physicalHeight ||
      s.canvasElement.clientWidth !== s.containerWidth ||
      s.canvasElement.clientHeight !== s.containerHeight
    ) {
      s.canvasElement.width = physicalWidth;
      s.canvasElement.height = physicalHeight;
      setStyle(s.canvasElement, {
        width: `${s.containerWidth}px`,
        height: `${s.containerHeight}px`,
      });

      s.ctx = null;
      this.lastPhysicalRect = EMPTY_RECT;
    }

    if (s.ctx === null) {
      s.ctx = s.canvasElement.getContext("2d");
    }

    this.prepareFrame();
  });

  private prepareFrame() {
    const {
      canvasElement,
      cellCallback,
      cols,
      containerHeight,
      containerWidth,
      ctx,
      pixelRatio,
      rows,
      scrollLeft,
      scrollTop,
      theme,
    } = this.state;

    assertNonNullishDEV(ctx);
    const physicalRect = new Rect(
      scrollLeft * pixelRatio,
      scrollTop * pixelRatio,
      canvasElement.width,
      canvasElement.height,
    );

    const lastRect = this.lastPhysicalRect;
    const reuse = rectIntersect(physicalRect, lastRect);
    if (reuse.width > 0 && reuse.height > 0) {
      ctx.drawImage(
        canvasElement,
        reuse.left - lastRect.left,
        reuse.top - lastRect.top,
        reuse.width,
        reuse.height,
        reuse.left - physicalRect.left,
        reuse.top - physicalRect.top,
        reuse.width,
        reuse.height,
      );
    }

    const minRow = Math.floor(scrollTop / ROW_HEIGHT_PX);
    const minCol = Math.floor(scrollLeft / COL_WIDTH_PX);
    const maxRow = Math.min(rows.length - 1, Math.ceil((scrollTop + containerHeight - 1) / ROW_HEIGHT_PX));
    const maxCol = Math.min(cols.length - 1, Math.ceil((scrollLeft + containerWidth - 1) / COL_WIDTH_PX));
    const cells: Cell[] = [];

    ctx.save();
    ctx.translate(-scrollLeft * pixelRatio, -scrollTop * pixelRatio);
    for (let r = minRow; r <= maxRow; r++) {
      ctx.fillStyle = parity(
        r,
        theme.rowEvenBackground,
        theme.rowOddBackground,
      );

      for (let c = minCol; c <= maxCol; c++) {
        const cellRect = rectFromExtent(
          Math.floor(pixelRatio * c * COL_WIDTH_PX),
          Math.floor(pixelRatio * r * ROW_HEIGHT_PX),
          Math.floor(pixelRatio * (c + 1) * COL_WIDTH_PX),
          Math.floor(pixelRatio * (r + 1) * ROW_HEIGHT_PX),
        );

        if (!rectContains(reuse, cellRect)) {
          ctx.fillRect(cellRect.left, cellRect.top, cellRect.width, cellRect.height);
          cells.push(new Cell(r, c, cellCallback(rows[r], cols[c])));
        }
      }
    }

    for (const renderer of this.renderers) {
      try {
        renderer.render(
          cells.filter((c) => c.value.kind === renderer.cellKind),
          {
            ctx,
            pixelRatio,
          },
        );
      } catch (e) {
        console.error(e);
      }
    }

    ctx.restore();
    this.lastPhysicalRect = physicalRect;
  }
}
