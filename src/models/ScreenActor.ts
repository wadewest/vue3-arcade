import Point from '@/models/Point';
import Rect from '@/models/Rect';

export default class ScreenActor {
  location: Point;
  velocity: Point|null;
  radius: number;
  bounding_box: Rect;
  status: string = 'active';

  constructor(location:Point, velocity:Point|null, radius:number, bounds:Rect) {
    this.location = location;
    this.velocity = velocity;
    this.radius = radius;
    this.bounding_box = bounds;
  }

  update(): void {
    if(this.status === 'dead' || this.velocity === null) return;
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
    if(!this.isInBounds()) {
      this.status = 'dead';
      return;
    }
  }

  draw(ctx: CanvasRenderingContext2D|null): void {
    if(!ctx || this.status === 'dead') return;
    ctx.beginPath();
    ctx.arc( this.location.x, this.location.y, 
      this.radius, 0, 2*Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  isInBounds() {
    return (
      this.location.x <= this.bounding_box.x + this.bounding_box.width
    ) && (
      this.location.y <= this.bounding_box.y + this.bounding_box.height
    ) && (
      this.location.x - this.radius >= this.bounding_box.x
    ) && (
      this.location.y - this.radius >= this.bounding_box.y
    )
  }

  move_to(p: Point, speed: number = 1): this {
    let atan2 = Math.atan2( 
      p.x - this.location.x,
      p.y - this.location.y
    );
    this.velocity = new Point(
      Math.sin(atan2)*speed, 
      Math.cos(atan2)*speed
    );
    return this;
  }

  teleport_to_random_border_location(): this {
    let side = Math.floor(Math.random()*4);
    switch(side) {
      case 0: // top
        this.location.x = this.bounding_box.x + Math.random()*(this.bounding_box.width-this.radius*2) - this.radius;
        this.location.y = this.bounding_box.y + this.radius;
        break;
      case 1: // right
        this.location.x = this.bounding_box.x + this.bounding_box.width - this.radius;
        this.location.y = this.bounding_box.y + Math.random()*(this.bounding_box.height-this.radius*2) - this.radius;
        break;
      case 2: // bottom
        this.location.x = this.bounding_box.x + Math.random()*(this.bounding_box.width-this.radius*2) - this.radius;
        this.location.y = this.bounding_box.y + this.bounding_box.height - this.radius;
        break;
      case 3: // left
        this.location.x = this.bounding_box.x + this.radius;
        this.location.y = this.bounding_box.y + Math.random()*(this.bounding_box.height-this.radius*2) - this.radius;
        break;
    }
    return this;
  }

}

