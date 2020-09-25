import { ILayer, TableCore } from "../core/types";

export class ColHeaderLayer implements ILayer {
  public render(_core: TableCore) {
    // const { ctx, pixelRatio } = context;
    // assertNonNullishDEV(ctx);
    // ctx.save();
    // ctx.scale(pixelRatio, pixelRatio);
    // for (const { col } of elements) {
    //   ctx.fillStyle = DEFAULT_THEME.colheaderBackground;
    //   ctx.fillRect(col * COL_WIDTH_PX, 0, COL_WIDTH_PX, ROW_HEIGHT_PX);
    //   ctx.fillStyle = DEFAULT_THEME.colheaderForeground;
    //   ctx.textBaseline = "top";
    //   ctx.font = DEFAULT_THEME.fontString;
    //   ctx.fillText(String(col), col * COL_WIDTH_PX + 4, 0);
    // }
    // ctx.restore();
  }
}
