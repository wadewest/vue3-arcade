
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

  distance_to(p: Point): number {
    let x = this.x - p.x;
    let y = this.y - p.y;
    return Math.sqrt((x*x) + (y*y));
  }

}

