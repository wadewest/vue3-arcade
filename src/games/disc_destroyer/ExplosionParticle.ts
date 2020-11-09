import Color from '@/models/Color';
import Point from '@/models/Point';
import ScreenCircle from '@/models/ScreenCircle';
import Explosion from './Explosion';

export default class ExplosionParticle extends ScreenCircle {

  decay_rate: number;

  constructor(explosion:Explosion, color:Color, radius:number = 2) {
    super(explosion.location.copy(), null, radius, explosion.bounding_box.copy());
    this.fill_color = color.copy();
    this.fill_color.alpha = 1.0;
    this.move_to(
      new Point(
        this.bounding_box.x+(Math.random()*this.bounding_box.width),
        this.bounding_box.y+(Math.random()*this.bounding_box.height),
      ),
      50+(Math.random()*50)
    );
    this.decay_rate = (Math.floor(Math.random()*1001)+1000)/1000.0;
  }

  did_update(delta_time:number): void {
    super.did_update(delta_time);
    const new_alpha = this.fill_color.alpha - (this.decay_rate*delta_time);
    if(new_alpha > 0.0) this.fill_color.alpha = new_alpha;
    else this.kill();
  }

}
