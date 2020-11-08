import GameWorld from '@/models/GameWorld';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import Sprite from '@/models/Sprite';
import ScreenCircle from '@/models/ScreenCircle';
import { GameStatus } from '@/models/GameStatus';
import GameStatePaused from './GameStatePaused';
import Player from './Player';
import Enemy from './Enemy';
import { SpriteStatus } from '@/models/SpriteStatus';

export default class DiscDestroyerWorld extends GameWorld {

  _player: Player;
  spawn_rate: number = 0;

  constructor(p:Player) {
    super();
    this._player = p;
    this.sprites.push([this._player])
    this.sprites.push([]);
    this.sprites.push([]);
    this.sprites.push([]);
  }

  get player(): Player { return this._player; }
  get projectiles(): Sprite[] { return this.sprites[1] }
  get enemies(): Enemy[] { return this.sprites[2] as Enemy[]; }
  get explosions(): Sprite[] { return this.sprites[3] }

  get is_paused(): boolean {
    return this.status == GameStatus.Paused
  }

  will_update(delta_time:number): boolean {
    if(Math.random()*1000 < this.spawn_rate) {
      const radius = Math.floor(Math.random()*15)+5
      this.enemies.push(new Enemy(this.viewport.grow(80, 80)));
    }
    return true;
  }

  did_update(): void {
    if(this.player.score < 200){
      this.spawn_rate = 2;
    } else if (this.player.score < 500) {
      this.spawn_rate = 3;
    } else if (this.player.score < 900) {
      this.spawn_rate = 5;
    } else {
      this.spawn_rate = 8;
    }
    if(this.player.health <= 0) {
      this.player.health = 0;
      this.state = new GameStatePaused(this);
    }
  }

  fire_projectile_to(location:Point): void {
    if(this.is_paused || this.projectiles.length >= 3) return;
    const projectile = new ScreenCircle(
      this.player.location.copy(),
      null,
      3,
      this.player.bounding_box.grow(5, 5)
    )
    .move_to(location, 500);
    projectile.did_leave_bounding_box = () => {
      projectile.kill();
      this.player.update_accuracy_score()
    };
    this.projectiles.push(projectile);
    this.player.shots_fired += 1;
  }

  detect_collisions(delta_time:number): void {
    this.enemies.forEach(enemy => {
      if(enemy.location.compare_distance(this.player.location, enemy.radius+this.player.radius) <= 0) {
        enemy.kill();
        this.player.health -= 1;
        this.make_explosion(enemy.location.copy(), enemy.radius*enemy.radius);
      }
      this.projectiles.forEach(p => {
        const projectile = p as ScreenCircle;
        if(enemy.location.compare_distance(projectile.location, enemy.radius+projectile.radius) <= 0) {
          enemy.take_damage();
          this.player.hits += 1;
          this.player.update_accuracy_score();
          projectile.kill();
          this.make_explosion(projectile.location.copy(), 25);
        }
      });
    });
  }

  sprite_cleanup(delta_time:number): void {
    this.enemies.forEach(enemy => {
      if(enemy.status === SpriteStatus.Dead) {
        if(enemy.health <= 0) {
          this.player.score += Math.round(10*this.player.accuracy);
        }
        this.make_explosion(enemy.location.copy(), 75);
      }
    })
    super.sprite_cleanup(delta_time);
  }

  make_explosion(location:Point, particle_count:number = 100) {
    let particle_size = 2;
    for(let i = 0; i < particle_count; i++) {
      const box_size = 100+(Math.floor(Math.random()*100));
      const particle = new ScreenCircle(
        location.copy(),
        null,
        particle_size,
        Rect.centered_at(location, box_size, box_size)
      );
      particle.move_to(
        new Point(
          particle.bounding_box.x+(Math.random()*particle.bounding_box.width),
          particle.bounding_box.y+(Math.random()*particle.bounding_box.height),
        ),
        50+(Math.random()*50)
      );
      this.explosions.push(particle);
    }
  }

}
