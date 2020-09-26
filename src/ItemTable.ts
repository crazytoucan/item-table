import { layoutModule } from "./core/layoutModule";
import { mouseModule } from "./core/mouseModule";
import { renderModule } from "./core/renderModule";
import { schedulingModule } from "./core/schedulingModule";
import { TableState } from "./core/types";
import { ICellCallback } from "./types";

export interface IItemTableOptions<TROW, TCOL> {
  element: HTMLElement;
  cellCallback: ICellCallback<TROW, TCOL>;
}

export class ItemTable<TROW, TCOL> {
  private table: TableState;
  constructor({ cellCallback, element }: IItemTableOptions<TROW, TCOL>) {
    this.table = new TableState(element);
    this.table.userCellCallback = cellCallback as ICellCallback<unknown, unknown>;
  }

  public start() {
    for (const module of [layoutModule, mouseModule, renderModule, schedulingModule]) {
      module(this.table);
    }

    this.table.onStart.emit();
  }

  set cols(cols: string[]) {
    this.table.userCols = cols;
    this.table.onDirty.emit();
  }

  set rows(rows: string[]) {
    this.table.userRows = rows;
    this.table.onDirty.emit();
  }

  removeListener() {
    // noop
  }

  addListener() {
    // noop
  }

  dispose() {
    this.table.onDispose.emit();
  }
}
