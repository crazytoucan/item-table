import { IFontMetrics } from "fontmetrics";
import { ICellCallback } from "../types";

export interface ICompiledTheme {
  cellPaddingTop: number;
  cellPaddingLeft: number;
  cellPaddingBottom: number;
  cellPaddingRight: number;
  colheaderBackground: string;
  colheaderForeground: string;
  rowEvenBackground: string;
  rowEvenForeground: string;
  gridline: string;
  rowOddBackground: string;
  rowOddForeground: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}

export interface IState {
  canvas: HTMLCanvasElement;
  cell: ICellCallback;
  cols: string[];
  containerElement: HTMLElement;
  containerHeight: number;
  containerWidth: number;
  ctx: CanvasRenderingContext2D | null;
  fontMetrics: IFontMetrics;
  modelHeight: number;
  modelWidth: number;
  pixelRatio: number;
  rows: string[];
  scrollX: number;
  scrollY: number;
  theme: ICompiledTheme;
}
