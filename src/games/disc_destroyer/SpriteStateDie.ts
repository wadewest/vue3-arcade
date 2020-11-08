import Enemy from './Enemy';
import SpriteStateShrink from './SpriteStateShrink';

export default class SpriteStateDie extends SpriteStateShrink {

  constructor(sprite:Enemy) {
    super(sprite);
    this.shrink_amount = sprite.radius;
    this.shrinK_speed = 25;
  }

  work_complete():void {
    this.sprite.kill();
  }

}
