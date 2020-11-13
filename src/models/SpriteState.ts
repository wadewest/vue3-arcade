import Sprite from './Sprite';
import { SpriteStatus } from './SpriteStatus';

export default class SpriteState {

  sprite: Sprite;
  protected status: SpriteStatus = SpriteStatus.Active;

  constructor(sprite:Sprite) {
    this.sprite = sprite;
  }

  work_complete():void {}

  get sprite_status():SpriteStatus {
    return this.status;
  }

  will_update(delta_time:number): boolean {
    return this.sprite.will_update(delta_time);
  }

  add_velocity(delta_time:number) {
    this.sprite.add_velocity(delta_time);
  }

  did_update(delta_time:number) {
    this.sprite.did_update(delta_time);
  }

  will_draw(ctx:CanvasRenderingContext2D): boolean {
    return this.sprite.will_draw(ctx);
  }

  draw_sprite(ctx:CanvasRenderingContext2D) {
    this.sprite.draw_sprite(ctx);
  }

  did_draw(ctx:CanvasRenderingContext2D) {
    this.sprite.did_draw(ctx);
  }

}
