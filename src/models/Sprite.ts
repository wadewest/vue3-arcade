import Point from '@/models/Point';
import Rect from '@/models/Rect';

export default abstract class Sprite {

  location: Point;
  velocity: Point|null;
  bounding_box: Rect;
  status: string = 'active';

  constructor(location:Point, velocity:Point|null, bounding_box:Rect) {
    this.location = location;
    this.velocity = velocity;
    this.bounding_box = bounding_box;
  }

  update(dt:number): void {
    if(this.status === 'dead' || this.velocity === null) return;
    this.location.x += this.velocity.x*dt;
    this.location.y += this.velocity.y*dt;
    if(!this.is_in_bounds()) {
      this.did_leave_bounding_box();
      return;
    }
  }

  did_leave_bounding_box():void {
    this.status = 'dead';
  }

  is_in_bounds(): boolean {
    return (
      this.collision_box.left > this.bounding_box.left
    ) && (
      this.collision_box.top > this.bounding_box.top
    ) && (
      this.collision_box.right < this.bounding_box.right
    ) && (
      this.collision_box.bottom < this.bounding_box.bottom
    )
  }

  may_collide(other_sprite:Sprite): boolean {
    return this.collision_box.intersects(other_sprite.collision_box);
  }

  abstract get collision_box(): Rect;
  abstract draw(ctx: CanvasRenderingContext2D|null): void;
}
