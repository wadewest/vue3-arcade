import Sprite from '@/models/Sprite';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import Color from './Color';

export default class ScreenRect extends Sprite {
  fill_color: Color = Color.create_random();
  width: number;
  height: number;

  constructor(location:Point, velocity:Point|null, width:number, height:number, bounding_box:Rect) {
    super(location, velocity, bounding_box);
    this.width = width;
    this.height = height;
  }

  get collision_box(): Rect {
    return Rect.centered_at(this.location, this.width, this.height);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if(!ctx || this.status === 'dead') return;
    ctx.fillStyle = this.fill_color.rgba;
    ctx.fillRect(
      this.collision_box.x,
      this.collision_box.y,
      this.collision_box.width, 
      this.collision_box.height
    );
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

}

