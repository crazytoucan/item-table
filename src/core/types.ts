import { ICellCallback } from "../types";

export interface ICompiledTheme {
  "cell.padding": [number, number, number, number];
  "colheader.background": string;
  "colheader.foreground": string;
  "core.evenBackground": string;
  "core.evenForeground": string;
  "core.gridline": string;
  "core.oddBackground": string;
  "core.oddForeground": string;
  "text.fontFamily": string;
  "text.fontSize": number;
  "text.fontWeight": number;
}

export interface IState {
  canvas: HTMLCanvasElement;
  cell: ICellCallback;
  cols: string[];
  containerElement: HTMLElement;
  containerHeight: number;
  containerWidth: number;
  ctx: CanvasRenderingContext2D | null;
  modelHeight: number;
  modelWidth: number;
  pixelRatio: number;
  rows: string[];
  scrollX: number;
  scrollY: number;
  theme: ICompiledTheme;
}
