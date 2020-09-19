declare module "fontmetrics" {
  interface IFontMetrics {
    capHeight: number;
    baseline: number;
    xHeight: number;
    descent: number;
    bottom: number;
    ascent: number;
    tittle: number;
    top: number;
    fontFamily: string;
    fontWeight: string | number;
    fontSize: number;
  }

  export default function FontMetrics(args: {
    fontFamily: string;
    // Optional (defaults)
    fontWeight?: string | number;
    fontSize?: number;
  }): IFontMetrics;
}
