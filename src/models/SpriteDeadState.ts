import Sprite from './Sprite';
import SpriteState from './SpriteState';
import { SpriteStatus } from './SpriteStatus';

export default class SpriteDeadState extends SpriteState {

  constructor(sprite:Sprite) {
    super(sprite);
    this.status = SpriteStatus.Dead;
  }

  will_update(delta_time:number): boolean { return false; }
  will_draw(ctx:CanvasRenderingContext2D) { return false; }

}