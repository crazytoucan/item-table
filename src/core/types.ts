import { IFontMetrics } from "fontmetrics";
import { ICellCallback } from "../types";
import { Cell } from "./Cell";
import { DEFAULT_THEME } from "./const";

export interface IState {
  canvasElement: HTMLCanvasElement;
  canvasContainerElement: HTMLElement;
  cellCallback: ICellCallback;
  cols: string[];
  containerElement: HTMLElement;
  containerHeight: number;
  containerWidth: number;
  scrollContentElement: HTMLElement;
  ctx: CanvasRenderingContext2D | null;
  fontMetrics: IFontMetrics;
  modelHeight: number;
  modelWidth: number;
  pixelRatio: number;
  rows: string[];
  scrollLeft: number;
  scrollTop: number;
  theme: typeof DEFAULT_THEME;
}

export interface IRenderContext {
  ctx: CanvasRenderingContext2D;
  pixelRatio: number;
}

export interface IRenderer {
  cellKind: string;
  render(cells: Cell[], context: IRenderContext): void;
}
