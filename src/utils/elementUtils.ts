import { IElementData, TableElement } from "../core/types";

export function elementFromParentList(...datas: IElementData[]) {
  let iter: TableElement | null = null;
  for (const data of datas.reverse()) {
    iter = new TableElement(data, iter);
  }

  return iter;
}
