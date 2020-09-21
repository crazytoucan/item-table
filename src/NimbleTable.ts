import { TableCore } from "./core/types";
import { layoutModule } from "./modules/layoutModule";
import { renderModule } from "./modules/renderModule";
import { ICellCallback } from "./types";
import { raf } from "./utils/raf";

export interface INimbleTableOptions {
  element: HTMLElement;
  cellCallback: ICellCallback;
}

export class NimbleTable {
  private core: TableCore;

  constructor({ cellCallback, element }: INimbleTableOptions) {
    this.core = new TableCore(element, this.render.schedule);
    this.core.cellCallback = cellCallback;
  }

  public start() {
    [layoutModule, renderModule].forEach((m) => m(this.core));
    this.core.onStart.emit({});
    this.render.schedule();
  }

  set cols(cols: string[]) {
    this.core.cols = cols;
    this.render.schedule();
  }

  set rows(rows: string[]) {
    this.core.rows = rows;
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
    this.core.onDispose.emit({});
  }

  private render = raf(() => {
    this.core.onRender.emit({});
  });
}
