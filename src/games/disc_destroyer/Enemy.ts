import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenCircle from '@/models/ScreenCircle';
import SpriteState from '@/models/SpriteState';
import SpriteStateDie from './SpriteStateDie';
import SpriteStateShrink from './SpriteStateShrink';

export default class Enemy extends ScreenCircle {

  health: number = 3;
  speed: number = 10;

  constructor(bounding_box:Rect) {
    super(Point.origin, null, 20, bounding_box);
    this.teleport_to_random_border_location();
    this.move_to(this.bounding_box.center, this.speed);
  }

  take_damage(): void {
    this.health -= 1;
    if(this.health <= 0) {
      this.state = new SpriteStateDie(this);
    } else {
      this.state = new SpriteStateShrink(this);
      this.speed *= 1.75;
      this.move_to(this.bounding_box.center, this.speed);
    }
  }

}
