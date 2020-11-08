import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenCircle from '@/models/ScreenCircle';
import SpriteState from '@/models/SpriteState';
import SpriteStateDie from './SpriteStateDie';
import SpriteStateShrink from './SpriteStateShrink';

export default class Enemy extends ScreenCircle {

  health: number;
  speed: number;

  constructor(bounding_box:Rect) {
    super(Point.origin, null, 0, bounding_box);
    this.speed = 15+Math.floor(Math.random()*6);
    this.health = 2+Math.floor(Math.random()*4);
    this.radius = 5+this.health*5;
    this.bounding_box = this.bounding_box.grow(this.radius*4, this.radius*4);
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
