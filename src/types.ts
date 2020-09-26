export interface ICell_Text {
  kind: "text";
  text: string;
}

export interface ICell_Blank {
  kind: "blank";
}

export type ICell = ICell_Text | ICell_Blank;
export interface ICellCallback<TROW, TCOL> {
  (row: TROW, col: TCOL): ICell;
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
