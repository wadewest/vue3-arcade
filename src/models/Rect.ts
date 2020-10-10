import Point from '@/models/Point';

export default class Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  midpoint() {
    return new Point(
      this.x + (this.width/2),
      this.y + (this.height/2)
    );
  }

}

