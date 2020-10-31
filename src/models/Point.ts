
export default class Point {
  x: number;
  y: number;
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  static get origin(): Point {
    return new Point(0,0);
  }

  midpoint(): Point {
    return new Point(this.x/2, this.y/2);
  }

  distance_to(p: Point): number {
    let x = this.x - p.x;
    let y = this.y - p.y;
    return Math.sqrt((x*x) + (y*y));
  }

  distance_to_is_less_than(p:Point, d:number): boolean {
    const x = this.x - p.x;
    const y = this.y - p.y;
    return (x*x)+(y*y)<(d*d);
  }

  distance_to_is_less_than_or_equal(p:Point, d:number): boolean {
    const x = this.x - p.x;
    const y = this.y - p.y;
    return (x*x)+(y*y)<=(d*d);
  }

  copy(): Point {
    return new Point(this.x, this.y);
  }

}

