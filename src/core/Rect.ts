export class Rect {
  constructor(
    public readonly left: number,
    public readonly top: number,
    public readonly width: number,
    public readonly height: number
  ) {}

  public get right() {
    return this.left + this.width;
  }

  public get bottom() {
    return this.top + this.height;
  }
}
