export interface ICell_Image {
  kind: "image";
  image: HTMLImageElement;
  width?: number;
  height?: number;
}

export interface ICell_Text {
  kind: "text";
  text: string;
  leftIcon?: HTMLImageElement;
  rightIcon?: HTMLImageElement;
  textOverflow?: "hidden" | "ellipsis";
  whiteSpace?: "nowrap" | "normal";
  lineClamp?: number;
}

export interface ICell_Blank {
  kind: "blank";
}

export type ICell = ICell_Image | ICell_Text | ICell_Blank;
export interface ICellCallback<TROW, TCOL> {
  (row: TROW, col: TCOL): ICell;
}

export interface ITheme {
  "cell.padding"?: number | [number, number, number, number];
  "colheader.background"?: string;
  "colheader.foreground"?: string;
  "core.background"?: string;
  "core.evenBackground"?: string;
  "core.evenForeground"?: string;
  "core.foreground"?: string;
  "core.gridline"?: string;
  "core.oddBackground"?: string;
  "core.oddForeground"?: string;
  "text.fontFamily"?: string;
  "text.fontSize"?: number;
  "text.fontWeight"?: number;
}

export interface IItemTableEventMap {
  "cell.dblclick": {
    row: string;
    col: string;
  };
}

export interface IItemTableEvent<K extends keyof IItemTableEventMap> {
  type: K;
  data: IItemTableEventMap[K];
}
