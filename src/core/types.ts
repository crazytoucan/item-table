import { CellLayer } from "../renderers/CellLayer";
import { ColHeaderLayer } from "../renderers/ColHeaderLayer";
import { TextCellRenderer } from "../renderers/TextCellRenderer";
import { ICellCallback } from "../types";
import { Hook } from "../utils/Hook";
import { DEFAULT_FONT_METRICS, DEFAULT_THEME } from "./const";

export class TableState {
  constructor(public containerElement: HTMLElement, public markDirty: () => void) {}

  public canvasContainerElement = document.createElement("div");
  public canvasElement = document.createElement("canvas");
  public cellCallback: ICellCallback<unknown, unknown> = () => ({ kind: "blank" });
  public cellRenderers = [new TextCellRenderer(DEFAULT_THEME, DEFAULT_FONT_METRICS)];
  public cols: string[] = [];
  public containerHeight = 0;
  public containerWidth = 0;
  public contentElement = document.createElement("div");
  public ctx: CanvasRenderingContext2D | null = null;
  public layers: ILayer[] = [new CellLayer(), new ColHeaderLayer()];
  public modelHeight = 0;
  public modelWidth = 0;
  public pixelRatio = 0;
  public rows: string[] = [];
  public scrollLeft = 0;
  public scrollTop = 0;
  public selection = new Set<number>([3]);

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

export interface ILayer {
  render(table: TableState, source: Rect, clean: Rect): void;
}

export interface ICellRenderer {
  cellKind: string;
  render(cells: Cell[], context: IRenderContext): void;
}

export class Cell {
  constructor(public row: number, public col: number, public value: any) {}
}

export class Rect {
  constructor(
    public readonly left: number,
    public readonly top: number,
    public readonly width: number,
    public readonly height: number,
  ) {}

  public get right() {
    return this.left + this.width;
  }

  public get bottom() {
    return this.top + this.height;
  }
}
