import { TextCellRenderer } from "../cellRenderers/TextCellRenderer";
import { ICellCallback } from "../types";
import { Hook } from "../utils/Hook";
import { Cell } from "./Cell";
import { DEFAULT_FONT_METRICS, DEFAULT_THEME } from "./const";

export class TableCore {
  constructor(public containerElement: HTMLElement, public markDirty: () => void) {}

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
  public renderers = [new TextCellRenderer(DEFAULT_THEME, DEFAULT_FONT_METRICS)];
  public rows: string[] = [];
  public scrollLeft = 0;
  public scrollTop = 0;

  public onCanvasInvalidated = new Hook();
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

export interface IRenderer {
  cellKind: string;
  render(cells: Cell[], context: IRenderContext): void;
}
