import Point from '@/models/Point';

export default class ScreenActor {
  location: Point;
  velocity: Point;
  radius: number;

  constructor(location:Point, velocity:Point, radius:number) {
    this.location = location;
    this.velocity = velocity;
    this.radius = radius;
  }

  update(): void {
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
  }

  draw(ctx): void {
    ctx.beginPath();
    ctx.arc( this.location.x, this.location.y, 
      this.radius, 0, 2*Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
  }

}

