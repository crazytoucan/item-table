import { DEFAULT_THEME } from "./core/const";
import { IState } from "./core/types";
import { renderCanvas } from "./graphics/renderCanvas";
import { ICellCallback, IDuratable } from "./types";
import { setStyle } from "./utils/htmlUtils";
import { raf } from "./utils/raf";

class Duratable implements IDuratable {
  private state: IState;
  private resizeObserver!: ResizeObserver;

  constructor(containerElement: HTMLElement) {
    const canvas = document.createElement("canvas");
    this.state = {
      canvas,
      cell: () => ({ kind: "blank" }),
      cols: [],
      containerElement,
      containerHeight: 0,
      containerWidth: 0,
      ctx: null,
      modelHeight: 0,
      modelWidth: 0,
      pixelRatio: 0,
      rows: [],
      scrollX: 0,
      scrollY: 0,
      theme: DEFAULT_THEME,
    };
  }

  public initialize() {
    const s = this.state;
    s.containerElement.appendChild(s.canvas);
    this.resizeObserver = new ResizeObserver(() => {
      this.render.schedule();
    });

    this.render.schedule();
  }

  set cellCallback(cb: ICellCallback) {
    this.state.cell = cb;
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
    s.containerElement.removeChild(s.canvas);
  }

  private render = raf(() => {
    const s = this.state;
    s.containerWidth = s.containerElement.clientWidth;
    s.containerHeight = s.containerElement.clientHeight;
    s.pixelRatio = devicePixelRatio;

    const physicalWidth = s.containerWidth * s.pixelRatio;
    const physicalHeight = s.containerHeight * s.pixelRatio;
    if (
      s.canvas.width !== physicalWidth ||
      s.canvas.height !== physicalHeight ||
      s.canvas.clientWidth !== s.containerWidth ||
      s.canvas.clientHeight !== s.containerHeight
    ) {
      s.canvas.width = physicalWidth;
      s.canvas.height = physicalHeight;
      setStyle(s.canvas, {
        width: `${s.containerWidth}px`,
        height: `${s.containerHeight}px`,
      });

      s.ctx = null;
    }

    if (s.ctx === null) {
      s.ctx = s.canvas.getContext("2d");
    }

    renderCanvas(s);
  });
}

export function createDuratable(element: HTMLElement) {
  const duratable = new Duratable(element);
  duratable.initialize();
  return duratable;
}
