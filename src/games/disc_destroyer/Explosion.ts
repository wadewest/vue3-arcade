import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenCircle from '@/models/ScreenCircle';
import Sprite from '@/models/Sprite';
import { SpriteStatus } from '@/models/SpriteStatus';
import ExplosionParticle from './ExplosionParticle';

export default class Explosion extends Sprite {

  particles: Sprite[] = [];

  constructor(exploder:ScreenCircle, particle_size = 2, particle_count = 100) {
    super(exploder.location.copy(), null, Rect.centered_at(exploder.location, 200, 200));
    for(let i = 0; i < particle_count; i++) {
      this.particles.push(new ExplosionParticle(this, exploder.fill_color, particle_size))
    }
  }

  get collision_box(): Rect {
    return Rect.null_rect.copy();
  }

  update(delta_time:number): void {
    this.particles = this.particles.filter(particle => {
      particle.update(delta_time);
      return particle.status !== SpriteStatus.Dead;
    })
  }

  draw_sprite(ctx:CanvasRenderingContext2D): void {
    this.particles.forEach(particle => particle.draw_sprite(ctx));
  }

}
