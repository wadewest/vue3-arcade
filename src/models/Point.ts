
export default class Point {
  x: number;
  y: number;
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
  midpoint(): Point {
    return new Point(this.x/2, this.y/2);
  }
}

