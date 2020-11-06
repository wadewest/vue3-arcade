
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

  compare_distance(p:Point, distance:number): number {
    const x = (this.x - p.x)*(this.x - p.x);
    const y = (this.y - p.y)*(this.y - p.y);
    const d = distance*distance
    if(x+y<d) return -1;
    else if(x+y>d) return 1;
    else return 0;
  }

  copy(): Point {
    return new Point(this.x, this.y);
  }

}

