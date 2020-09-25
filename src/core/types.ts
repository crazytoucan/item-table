import { CellLayer } from "../renderers/CellLayer";
import { ColHeaderLayer } from "../renderers/ColHeaderLayer";
import { TextCellRenderer } from "../renderers/TextCellRenderer";
import { ICellCallback } from "../types";
import { Hook } from "../utils/Hook";
import { Cell } from "./Cell";
import { DEFAULT_FONT_METRICS, DEFAULT_THEME } from "./const";
import { Rect } from "./Rect";

export class TableCore {
  constructor(public containerElement: HTMLElement, public markDirty: () => void, public flush: () => void) {}

  public canvasElement = document.createElement("canvas");
  public canvasContainerElement = document.createElement("div");
  public cellCallback: ICellCallback = () => ({ kind: "blank" });
  public cols: string[] = [];
  public containerHeight = 0;
  public containerWidth = 0;
  public contentElement = document.createElement("div");
  public ctx: CanvasRenderingContext2D | null = null;
  public modelHeight = 0;
  public modelWidth = 0;
  public pixelRatio = 0;
  public cellRenderers = [new TextCellRenderer(DEFAULT_THEME, DEFAULT_FONT_METRICS)];
  public layers: ILayer[] = [new CellLayer(), new ColHeaderLayer()];
  public selection = new Set<number>([3]);

  public rows: string[] = [];
  public scrollLeft = 0;
  public scrollTop = 0;

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
  render(core: TableCore, source: Rect, clean: Rect): void;
}

export interface ICellRenderer {
  cellKind: string;
  render(cells: Cell[], context: IRenderContext): void;
}
