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

  midpoint(): Point {
    return new Point(
      this.x + (this.width/2),
      this.y + (this.height/2)
    );
  }

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

  copy(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

}

