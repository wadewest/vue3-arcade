import Sprite from '@/models/Sprite';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import Color from './Color';

export default class ScreenCircle extends Sprite {
  radius: number;
  fill_color: Color = Color.create_random();

  constructor(location:Point, velocity:Point|null, radius:number, bounding_box:Rect) {
    super(location, velocity, bounding_box);
    this.radius = radius;
  }

  get collision_box():Rect {
    return Rect.centered_at(this.location, this.radius*2, this.radius*2);
  }

  draw_sprite(ctx:CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.radius, 0, 2*Math.PI, false);
    ctx.fillStyle = this.fill_color.rgba;
    ctx.fill();
  }

  move_to(p:Point, speed:number = 1): this {
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

