import Point from '@/models/Point';

export default class Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x:number, y:number, width:number, height:number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  static get null_rect(): Rect {
    return new Rect(0, 0, 0, 0);
  }

  static centered_at(location:Point, width:number, height:number): Rect {
    const rect = new Rect(0, 0, width, height);
    rect.center = location.copy();
    return rect;
  }

  get center(): Point {
    return new Point(
      this.x + (this.width/2),
      this.y + (this.height/2)
    );
  }
  set center(location:Point) {
    this.x = location.x - this.width/2;
    this.y = location.y - this.height/2;
  }

  midpoint(): Point {
    return this.center;
  }

  get top():number { return this.y; }
  get bottom():number { return this.y + this.height; }
  get left():number { return this.x; }
  get right():number { return this.x + this.width; }

  grow(width: number, height: number): Rect {
    let new_x = this.x - (width/2);
    let new_y = this.y - (height/2);
    let new_width = this.width + width;
    let new_height = this.height + height;
    return new Rect(new_x, new_y, new_width, new_height);
  }

  shrink(width: number, height: number): Rect {
    return this.grow(-width, -height);
  }

  contains(point:Point): boolean {
    return (point.x >= this.left && point.x <= this.right) &&
      (point.y >= this.top && point.y <= this.bottom);
  }

  intersects(other_rect:Rect): boolean {
    return !((this.right < other_rect.left) ||
    (this.left > other_rect.right) ||
    (this.bottom < other_rect.top) ||
    (this.top > other_rect.bottom))
  }

  intersection(other_rect:Rect): Rect|null {
    if(!this.intersects(other_rect)) return null;
    const new_x = Math.max(this.left, other_rect.left);
    const new_y = Math.max(this.top, other_rect.top);
    return new Rect( new_x, new_y,
      Math.min(this.right, other_rect.right) - new_x,
      Math.min(this.bottom, other_rect.bottom) - new_y,
    );
  }

  copy(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

}

