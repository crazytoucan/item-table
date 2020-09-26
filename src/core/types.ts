import { CellLayer } from "../renderers/CellLayer";
import { ColHeaderLayer } from "../renderers/ColHeaderLayer";
import { TextCellRenderer } from "../renderers/TextCellRenderer";
import { ICellCallback } from "../types";
import { Hook } from "../utils/Hook";
import { DEFAULT_FONT_METRICS, DEFAULT_THEME } from "./const";

export type csscoord_t = number;
export type rendercoord_t = number;
export type row_t = number;
export type col_t = number;

export class TableState {
  constructor(public containerElement: HTMLElement) {}

  public canvasContainerElement = document.createElement("div");
  public canvasElement = document.createElement("canvas");
  public cellRenderers = [new TextCellRenderer(DEFAULT_THEME, DEFAULT_FONT_METRICS)];
  public containerHeight: csscoord_t = 0;
  public containerWidth: csscoord_t = 0;
  public contentElement = document.createElement("div");
  public ctx: CanvasRenderingContext2D | null = null;
  public layers: Layer[] = [new CellLayer(), new ColHeaderLayer()];
  public pixelRatio = 0;
  public scrollLeft: csscoord_t = 0;
  public scrollTop: csscoord_t = 0;
  public selection = new Set<number>([3]);
  public userCellCallback: ICellCallback<unknown, unknown> = () => ({ kind: "blank" });
  public userCols: string[] = [];
  public userRows: string[] = [];
  public virtualHeight: rendercoord_t = 0;
  public virtualWidth: rendercoord_t = 0;

  public onDirty = new Hook();
  public onInvalidate = new Hook();
  public onDispose = new Hook();
  public onResize = new Hook();
  public onBeforeRender = new Hook();
  public onRender = new Hook();
  public onStart = new Hook();
}

export interface IRenderContext {
  ctx: CanvasRenderingContext2D;
  pixelRatio: number;
}

export class TableElement {
  constructor(public data: IElementData, public parent: TableElement | null) {}
}

export type IElementData =
  | {
      type: "colheader_resize_handle";
      col: col_t;
    }
  | {
      type: "colheader";
      col: col_t;
    }
  | {
      type: "cell";
      row: row_t;
      col: col_t;
    }
  | {
      type: "row";
      row: row_t;
    }
  | {
      type: "root";
    };

export interface Layer {
  render(table: TableState, source: Rect<rendercoord_t>, clean: Rect<rendercoord_t>): void;
  query(table: TableState, x: rendercoord_t, y: rendercoord_t): TableElement | null;
}

export interface CellRenderer {
  cellKind: string;
  render(cells: Cell[], context: IRenderContext): void;
}

export class Cell {
  constructor(public row: row_t, public col: col_t, public value: any) {}
}

export class Rect<T extends number = number> {
  constructor(
    public readonly left: T,
    public readonly top: T,
    public readonly width: T,
    public readonly height: T,
  ) {}

  public get right() {
    return (this.left + this.width) as T;
  }

  public get bottom() {
    return (this.top + this.height) as T;
  }
}
