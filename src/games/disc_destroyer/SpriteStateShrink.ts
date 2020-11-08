import SpriteState from '@/models/SpriteState';
import Enemy from './Enemy';

export default class SpriteStateShrink extends SpriteState {

  old_state: SpriteState;
  shrink_amount: number = 5;
  shrinK_speed: number = 2;

  constructor(sprite:Enemy) {
    super(sprite);
    this.old_state = sprite.state;
  }

  work_complete(): void {
    this.sprite.state = this.old_state;
  }

  will_update(delta_time:number): boolean {
    const shrink_by = this.shrink_amount * delta_time * this.shrinK_speed;
    (this.sprite as Enemy).radius -= shrink_by;
    this.shrink_amount -= shrink_by;
    if(this.shrink_amount <= 0.1) this.work_complete();
    return super.will_update(delta_time);
  }

}
