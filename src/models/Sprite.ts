import Point from '@/models/Point';
import Rect from '@/models/Rect';
import SpriteDeadState from './SpriteDeadState';
import SpriteState from './SpriteState';
import { SpriteStatus } from './SpriteStatus';

export default abstract class Sprite {

  location: Point;
  velocity: Point|null;
  bounding_box: Rect;
  state: SpriteState;

  constructor(location:Point, velocity:Point|null, bounding_box:Rect) {
    this.location = location;
    this.velocity = velocity;
    this.bounding_box = bounding_box;
    this.state = new SpriteState(this);
  }

  abstract get collision_box(): Rect;

  get status(): SpriteStatus {
    return this.state.sprite_status;
  }

  kill(): void {
    this.state = new SpriteDeadState(this);
  }

  update(delta_time:number): void {
    if(this.state.will_update(delta_time)) {
      this.state.add_velocity(delta_time);
      this.state.did_update(delta_time);
    }
    if(!this.is_in_bounds()) {
      this.did_leave_bounding_box();
      return;
    }
  }

  will_update(delta_time:number): boolean { return true; }

  add_velocity(delta_time:number): void {
    if(this.velocity != null) {
      this.location.x += this.velocity.x*delta_time;
      this.location.y += this.velocity.y*delta_time;
    }
  }

  did_update(delta_time:number): void {}

  did_leave_bounding_box():void {
    this.kill();
  }

  is_in_bounds(): boolean {
    return this.collision_box.intersects(this.bounding_box);
  }

  may_collide(other_sprite:Sprite): boolean {
    return this.collision_box.intersects(other_sprite.collision_box);
  }

  draw(ctx:CanvasRenderingContext2D): void {
    if(this.state.will_draw(ctx)) {
      this.state.draw_sprite(ctx);
      this.state.did_draw(ctx);
    }
  }

  will_draw(ctx:CanvasRenderingContext2D): boolean { return true; }
  did_draw(ctx:CanvasRenderingContext2D): void {}

  abstract draw_sprite(ctx:CanvasRenderingContext2D): void;

}
