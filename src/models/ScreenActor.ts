import Point from '@/models/Point';
import Rect from '@/models/Rect';

export default class ScreenActor {
  location: Point;
  velocity: Point;
  radius: number;
  bounds: Rect;
  status: string = 'active';

  constructor(location:Point, velocity:Point, radius:number, bounds:Rect) {
    this.location = location;
    this.velocity = velocity;
    this.radius = radius;
    this.bounds = bounds;
  }

  update(): void {
    if(this.status === 'dead') return;
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
    if(!this.isInBounds()) {
      this.status = 'dead';
      return;
    }
  }

  draw(ctx): void {
    if(this.status === 'dead') return;
    ctx.beginPath();
    ctx.arc( this.location.x, this.location.y, 
      this.radius, 0, 2*Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  isInBounds() {
    return (
      this.location.x < this.bounds.x + this.bounds.width
    ) && (
      this.location.y < this.bounds.y + this.bounds.height
    ) && (
      this.location.x - this.radius > this.bounds.x
    ) && (
      this.location.y - this.radius > this.bounds.y
    )
  }

}

