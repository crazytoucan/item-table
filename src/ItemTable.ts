import { TableState } from "./core/types";
import { layoutModule } from "./modules/layoutModule";
import { mouseModule } from "./modules/mouseModule";
import { renderModule } from "./modules/renderModule";
import { ICellCallback } from "./types";
import { raf } from "./utils/raf";

export interface IItemTableOptions<TROW, TCOL> {
  element: HTMLElement;
  cellCallback: ICellCallback<TROW, TCOL>;
}

export class ItemTable<TROW, TCOL> {
  private tableState: TableState;
  constructor({ cellCallback, element }: IItemTableOptions<TROW, TCOL>) {
    this.tableState = new TableState(element, this.render.schedule);
    this.tableState.cellCallback = cellCallback as ICellCallback<unknown, unknown>;
  }

  public start() {
    [layoutModule, mouseModule, renderModule].forEach((m) => m(this.tableState));
    this.tableState.onStart.emit();
    this.render.schedule();
  }

  set cols(cols: string[]) {
    this.tableState.cols = cols;
    this.render.schedule();
  }

  set rows(rows: string[]) {
    this.tableState.rows = rows;
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
    this.tableState.onDispose.emit();
  }

  private render = raf(() => {
    this.tableState.onBeforeRender.emit();
    this.tableState.onRender.emit();
  });
}
