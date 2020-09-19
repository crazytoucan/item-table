import { IFontMetrics } from "fontmetrics";
import { ICellCallback } from "../types";
import { DEFAULT_THEME } from './const';

export interface IState {
  canvas: HTMLCanvasElement;
  cell: ICellCallback;
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
  scrollX: number;
  scrollY: number;
  theme: typeof DEFAULT_THEME;
}
